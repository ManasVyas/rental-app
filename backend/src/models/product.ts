import { Op } from "sequelize";
import { Column, HasMany, Table } from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import Rental from "./rental";
import Category from "./category";
import Location from "./location";
import ProductLocation from "./productlocation";
import ProductCategory from "./productcategory";

@Table({
  tableName: "product",
  timestamps: true,
})
export default class Product extends BaseModel<Product> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "product_id",
  })
  productId: number;

  @Column({
    allowNull: false,
    field: "name",
  })
  name: string;

  @Column({
    allowNull: false,
    field: "stock_count",
  })
  stockCount: number;

  @Column({
    allowNull: false,
    field: "daily_rental_rate",
  })
  dailyRentalRate: number;

  @HasMany(() => ProductCategory)
  productCategories: ProductCategory[];

  @HasMany(() => ProductLocation)
  productLocations: ProductLocation[];

  @HasMany(() => Rental)
  rentals: Rental[];

  static async getAllData(deleteResult: Boolean = false) {
    const where = deleteResult
      ? { deleteFlag: BaseModel.ACTIVE_DELETE_FLAG }
      : { deleteFlag: BaseModel.INACTIVE_DELETE_FLAG };

    return Product.findAll({
      attributes: [
        "productId",
        "name",
        "stockCount",
        "dailyRentalRate",
        "deleteFlag",
      ],
      include: [
        {
          model: ProductCategory,
          attributes: [
            "productCategoryId",
            "categoryId",
            "categoryName",
            "deleteFlag",
          ],
        },
        {
          model: ProductLocation,
          attributes: [
            "productLocationId",
            "locationId",
            "locationName",
            "deleteFlag",
          ],
        },
      ],
      where,
      order: [["productId", "DESC"]],
    });
  }

  static async getData(productId: string) {
    return Product.findByPk(productId, {
      attributes: [
        "productId",
        "name",
        "stockCount",
        "dailyRentalRate",
        "deleteFlag",
      ],
      include: [
        {
          model: ProductCategory,
          attributes: [
            "productCategoryId",
            "categoryId",
            "categoryName",
            "deleteFlag",
          ],
        },
        {
          model: ProductLocation,
          attributes: [
            "productLocationId",
            "locationId",
            "locationName",
            "deleteFlag",
          ],
        },
      ],
    });
  }

  static async addData(data: any) {
    data.createdBy = global["userId"];
    data.updatedBy = global["userId"];
    BaseModel.prepareChildren(data, "productLocations");
    BaseModel.prepareChildren(data, "productCategories");
    const categoryIds = data.productCategories.map((e) => e.categoryId);
    const locationIds = data.productLocations.map((e) => e.locationId);
    const categories = await Category.findAll({
      attributes: ["categoryId", "name"],
      where: {
        categoryId: {
          [Op.in]: categoryIds,
        },
      },
    });
    const locations = await Location.findAll({
      attributes: ["locationId", "name"],
      where: {
        locationId: {
          [Op.in]: locationIds,
        },
      },
    });
    data.productCategories.forEach((productCategory) => {
      const category = categories.find(
        (e) => e.categoryId === productCategory.categoryId
      );
      productCategory.categoryName = category.name;
      productCategory.createdBy = data.createdBy;
    });
    data.productLocations.forEach((productLocation) => {
      const location = locations.find(
        (e) => e.locationId === productLocation.locationId
      );
      productLocation.locationName = location.name;
      productLocation.createdBy = data.createdBy;
    });
    let product = new Product(data, {
      include: [ProductCategory, ProductLocation],
    });
    return await product.save();
  }

  static async updateData(data: any) {
    data.updatedBy = global["userId"];
    BaseModel.prepareChildren(data, "productCategories", true);
    BaseModel.prepareChildren(data, "productLocations", true);
    const product = await Product.findByPk(data.productId, {
      include: [ProductCategory, ProductLocation],
    });
    console.log("product", product);

    const productCategoryDelta = BaseModel.getDelta(
      product.productCategories,
      data.productCategories,
      "productCategoryId"
    );
    const addedCategoryIds = productCategoryDelta.added.map(
      (e) => e.categoryId
    );
    const addedCategories = await Category.findAll({
      attributes: ["categoryId", "name"],
      where: { categoryId: addedCategoryIds },
    });

    const productLocationDelta = BaseModel.getDelta(
      product.productLocations,
      data.productLocations,
      "productLocationId"
    );
    const addedLocationIds = productLocationDelta.added.map(
      (e) => e.locationId
    );
    const addedLocations = await Location.findAll({
      attributes: ["locationId", "name"],
      where: { locationId: addedLocationIds },
    });

    return await this.sequelize
      .transaction(async (transaction) => {
        await Promise.all([
          productCategoryDelta.added.map(async (productCategory) => {
            let category = addedCategories.find(
              (e) => e.categoryId === productCategory.categoryId
            );
            productCategory.createdBy = data.updatedBy;
            productCategory.categoryName = category.name;
            await product.$create("productCategory", productCategory, {
              transaction,
            });
          }),
          productLocationDelta.added.map(async (productLocation) => {
            let location = addedLocations.find(
              (e) => e.locationId === productLocation.locationId
            );
            productLocation.createdBy = data.updatedBy;
            productLocation.locationName = location.name;
            await product.$create("productLocation", productLocation, {
              transaction,
            });
          }),
          productCategoryDelta.deleted.map(async (productCategory) => {
            await productCategory.destroy({ transaction });
          }),
          productLocationDelta.deleted.map(async (productLocation) => {
            await productLocation.destroy({ transaction });
          }),
        ]);
        return await product.update(data, { transaction });
      })
      .then((product) => {
        return Product.findByPk(product.productId, {
          include: [ProductCategory, ProductLocation],
        });
      });
  }

  static async deleteData(productId: string) {
    const result = await Product.update(
      {
        deleteFlag: BaseModel.INACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },
      { where: { productId } }
    );
    const updated = result[0] && result[0] > 0;

    let updated1: boolean;
    if (updated) {
      const result = await ProductCategory.update(
        {
          deleteFlag: BaseModel.INACTIVE_DELETE_FLAG,
          updatedBy: global["userId"],
        },
        {
          where: { productId },
        }
      );
      updated1 = result[0] && result[0] > 0;
    }

    let updated2: boolean;
    if (updated) {
      const result = await ProductLocation.update(
        {
          deleteFlag: BaseModel.INACTIVE_DELETE_FLAG,
          updatedBy: global["userId"],
        },
        {
          where: { productId },
        }
      );
      updated2 = result[0] && result[0] > 0;
    }
  }

  static async restoreData(productId: string) {
    const result = await Product.update(
      {
        deleteFlag: BaseModel.ACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },

      { where: { productId } }
    );
    const updated = result[0] && result[0] > 0;
    let updated1: boolean;
    if (updated) {
      const result = await ProductCategory.update(
        {
          deleteFlag: BaseModel.ACTIVE_DELETE_FLAG,
          updatedBy: global["userId"],
        },
        {
          where: { productId },
        }
      );
      updated1 = result[0] && result[0] > 0;
    }

    let updated2: boolean;
    if (updated) {
      const result = await ProductLocation.update(
        {
          deleteFlag: BaseModel.ACTIVE_DELETE_FLAG,
          updatedBy: global["userId"],
        },
        {
          where: { productId },
        }
      );
      updated2 = result[0] && result[0] > 0;
    }
  }
}
