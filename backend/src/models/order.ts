import { Op } from "sequelize";
import {
  Column,
  ForeignKey,
  BelongsTo,
  Table,
  HasMany,
} from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import Product from "./product";
import Rental from "./rental";
import User from "./user";

@Table({
  tableName: "order",
  timestamps: true,
})
export default class Order extends BaseModel<Order> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "order_id",
  })
  orderId: number;

  @Column({
    allowNull: false,
    field: "grand_total",
  })
  grandTotal: number;

  @Column({
    field: "user_id",
  })
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Rental)
  rentals: Rental[];

  static async getAllData(deleteResult: Boolean = false) {
    const where = deleteResult
      ? { deleteFlag: BaseModel.ACTIVE_DELETE_FLAG }
      : { deleteFlag: BaseModel.INACTIVE_DELETE_FLAG };

    return Order.findAll({
      attributes: ["orderId", "grandTotal", "userId", "deleteFlag"],
      include: [
        {
          model: Rental,
          attributes: [
            "rentalId",
            "dateOut",
            "dateReturned",
            "rentalDays",
            "dailyRentalRate",
            "totalRentalRate",
            "productId",
          ],
        },
      ],
      where,
      order: [["orderId", "DESC"]],
    });
  }

  static async getData(orderId: string) {
    return Order.findByPk(orderId, {
      attributes: ["orderId", "grandTotal", "userId", "deleteFlag"],
      include: [
        {
          model: Rental,
          attributes: [
            "rentalId",
            "dateOut",
            "dateReturned",
            "rentalDays",
            "dailyRentalRate",
            "totalRentalRate",
            "productId",
          ],
        },
      ],
    });
  }

  static async addData(data: any) {
    data.createdBy = global["userId"];
    data.updatedBy = global["userId"];

    BaseModel.prepareChildren(data, "rentals");
    const productIds = data.rentals.map((e) => e.productId);
    const products = await Product.findAll({
      attributes: ["productId", "stockCount", "dailyRentalRate"],
      where: {
        productId: {
          [Op.in]: productIds,
        },
      },
    });

    for (let i = 0; i < data.rentals.length; i++) {
      let product = products.find(
        (e) => e.productId === data.rentals[i].productId
      );

      let date_1 = data.rentals[i].dateOut.split("/");
      data.rentals[i].dateOut = new Date(date_1[0], date_1[1] - 1, date_1[2]);
      let date_2 = data.rentals[i].dateReturned.split("/");
      data.rentals[i].dateReturned = new Date(
        date_2[0],
        date_2[1] - 1,
        date_2[2]
      );
      data.rentals[i].rentalDays = Math.round(
        (data.rentals[i].dateReturned - data.rentals[i].dateOut) /
          (1000 * 60 * 60 * 24)
      );

      data.rentals[i].totalRentalRate =
        product.dailyRentalRate * data.rentals[i].rentalDays;
      data.rentals[i].dailyRentalRate = product.dailyRentalRate;
      product.stockCount -= 1;
      await Product.update(
        { stockCount: product.stockCount },
        { returning: true, where: { productId: product.productId } }
      );
    }

    data.grandTotal = 0;
    data.rentals.forEach((rental) => {
      data.grandTotal += Number(rental.totalRentalRate);
    });
    let order = new Order(data, { include: [Rental] });
    return await order.save();
  }

  static async updateData(data: any) {
    data.updatedBy = global["userId"];
    BaseModel.prepareChildren(data, "rentals", true);
    const order = await Order.findByPk(data.orderId, {
      include: [Rental],
    });

    const rentalDelta = BaseModel.getDelta(
      order.rentals,
      data.rentals,
      "rentalId"
    );
    const addedProductIds = rentalDelta.added.map((e) => e.productId);
    const changedProductIds = rentalDelta.changed.map((e) => e.productId);
    const deletedProductIds = rentalDelta.deleted.map((e) => e.productId);

    const addedProducts = await Product.findAll({
      attributes: ["productId", "dailyRentalRate", "stockCount"],
      where: { productId: addedProductIds },
    });
    const changedProducts = await Product.findAll({
      attributes: ["productId", "dailyRentalRate"],
      where: { productId: changedProductIds },
    });
    const deletedProducts = await Product.findAll({
      attributes: ["productId", "dailyRentalRate", "stockCount"],
      where: { productId: deletedProductIds },
    });
    data.grandTotal = 0;
    return await this.sequelize
      .transaction(async (transaction) => {
        await Promise.all([
          rentalDelta.added.map(async (rental) => {
            let product = addedProducts.find(
              (e) => e.productId === rental.productId
            );
            let date_1 = rental.dateOut.split("/");
            rental.dateOut = new Date(date_1[0], date_1[1] - 1, date_1[2]);
            let date_2 = rental.dateReturned.split("/");
            rental.dateReturned = new Date(date_2[0], date_2[1] - 1, date_2[2]);
            rental.rentalDays = Math.round(
              (rental.dateReturned - rental.dateOut) / (1000 * 60 * 60 * 24)
            );
            rental.totalRentalRate =
              product.dailyRentalRate * rental.rentalDays;
            rental.dailyRentalRate = product.dailyRentalRate;
            rental.createdBy = data.updatedBy;
            data.grandTotal += Number(rental.totalRentalRate);
            await Product.update(
              { stockCount: product.stockCount - 1 },
              { transaction, where: { productId: product.productId } }
            );
            await order.$create("rental", rental, { transaction });
          }),
          rentalDelta.changed.map(async (rentalData) => {
            const rental = order.rentals.find(
              (_rental) => _rental.rentalId === rentalData.rentalId
            );
            const product = changedProducts.find(
              (e) => e.productId === rental.productId
            );
            let date_1 = rentalData.dateOut.split("/");
            rentalData.dateOut = new Date(date_1[0], date_1[1] - 1, date_1[2]);
            let date_2 = rentalData.dateReturned.split("/");
            rentalData.dateReturned = new Date(
              date_2[0],
              date_2[1] - 1,
              date_2[2]
            );
            rentalData.rentalDays = Math.round(
              (rentalData.dateReturned - rentalData.dateOut) /
                (1000 * 60 * 60 * 24)
            );

            rentalData.totalRentalRate =
              product.dailyRentalRate * rentalData.rentalDays;
            rentalData.dailyRentalRate = product.dailyRentalRate;
            rentalData.updatedBy = data.createdBy;
            data.grandTotal += Number(rentalData.totalRentalRate);
            await rental.update(rentalData, { transaction });
          }),
          rentalDelta.deleted.map(async (rental) => {
            let product = deletedProducts.find(
              (e) => e.productId === rental.productId
            );
            await Product.update(
              { stockCount: product.stockCount + 1 },
              { transaction, where: { productId: product.productId } }
            );
            await rental.destroy({ transaction });
          }),
        ]);
        return await order.update(data, { transaction });
      })
      .then((order) => {
        return Order.findByPk(order.orderId, { include: [Rental] });
      });
  }

  static async deleteData(orderId: string) {
    const result = await Order.update(
      {
        deleteFlag: BaseModel.INACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },
      { where: { orderId } }
    );
    const updated = result[0] && result[0] > 0;

    let updated1: boolean;
    if (updated) {
      const result = await Rental.update(
        {
          deleteFlag: BaseModel.INACTIVE_DELETE_FLAG,
          updatedBy: global["userId"],
        },
        {
          where: { orderId },
        }
      );
      updated1 = result[0] && result[0] > 0;
    }
  }

  static async restoreData(orderId: string) {
    const result = await Order.update(
      {
        deleteFlag: BaseModel.ACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },
      { where: { orderId } }
    );
    const updated = result[0] && result[0] > 0;

    let updated1: boolean;
    if (updated) {
      const result = await Rental.update(
        {
          deleteFlag: BaseModel.ACTIVE_DELETE_FLAG,
          updatedBy: global["userId"],
        },
        {
          where: { orderId },
        }
      );
      updated1 = result[0] && result[0] > 0;
    }
  }
}
