import { Op } from "sequelize";
import { Column, HasMany, Table } from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import Order from "./order";
import Phone from "./phone";
import { isPasswordValid } from "../utility/utility";
import { genSalt, hash } from "bcryptjs";
import Rental from "./rental";

@Table({
  tableName: "user",
  timestamps: true,
})
export default class User extends BaseModel<User> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "user_id",
  })
  userId: number;

  @Column({
    allowNull: false,
    field: "user_name",
  })
  userName: string;

  @Column({
    allowNull: false,
    field: "email",
  })
  email: string;

  @Column({
    allowNull: false,
    field: "password",
  })
  password: string;

  @Column({
    allowNull: true,
    field: "token",
  })
  token: string;

  @Column({
    allowNull: false,
    field: "role",
  })
  role: string;

  @HasMany(() => Phone)
  phones: Phone[];

  @HasMany(() => Order)
  orders: Order[];

  static async _exists(data: any) {
    const where = {
      email: { [Op.iLike]: data.email },
    };
    return User.findOne({
      where,
      attributes: ["userId", "userName", "email"],
    });
  }

  static async getAllData(deleteResult: Boolean = false) {
    const where = deleteResult
      ? { deleteFlag: BaseModel.ACTIVE_DELETE_FLAG }
      : { deleteFlag: BaseModel.INACTIVE_DELETE_FLAG };

    return User.findAll({
      attributes: ["userId", "userName", "email", "role", "deleteFlag"],
      include: [
        {
          model: Phone,
          attributes: ["phoneId", "phoneNumber"],
        },
        {
          model: Order,
          attributes: ["orderId", "grandTotal"],
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
        },
      ],
      where,
      order: [["userId", "DESC"]],
    });
  }

  static async getData(userId: string) {
    return User.findByPk(userId, {
      attributes: ["userId", "userName", "email", "role", "deleteFlag"],
    });
  }

  static async addData(data: any) {
    const userExists = await this._exists(data);

    if (userExists) {
      return { error: "ALREADY_EXISTS" };
    }

    data.createdBy = global["userId"];
    data.updatedBy = global["userId"];

    let user = new User(data);

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    await user.save();
    return user;
  }

  static async logInUser(data: any) {
    const user = await User.findOne({
      where: { email: data.email },
    });
    if (user === null) return { error: "User doesn't exists" };

    const result = await isPasswordValid(data.password, user.password);
    console.log("result", result);

    if (result === false) return { error: "Invalid Password" };

    return user;
  }

  static async updateData(data: any) {
    const userExists = await this._exists(data);

    if (userExists) {
      return { error: "ALREADY_EXISTS" };
    }
    data.updatedBy = global["userId"];

    const result = await User.update(data, {
      returning: true,
      where: { userId: data.userId },
    });
    return BaseModel.checkUpdate(result);
  }

  static async deleteData(userId: string) {
    const result = await User.update(
      {
        deleteFlag: BaseModel.INACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },
      { where: { userId } }
    );
    return result[0] && result[0] > 0;
  }

  static async restoreData(userId: string) {
    const result = await User.update(
      {
        deleteFlag: BaseModel.ACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },

      { where: { userId } }
    );
    return result[0] && result[0] > 0;
  }
}
