import { Op } from "sequelize";
import { Column, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import User from "./user";

@Table({
  tableName: "phone",
  timestamps: true,
})
export default class Phone extends BaseModel<Phone> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "phone_id",
  })
  phoneId: number;

  @Column({
    allowNull: false,
    field: "phone_number",
  })
  phoneNumber: string;

  @Column({
    allowNull: false,
    field: "user_id",
  })
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  static async _exists(data: any) {
    const where = {
      phoneNumber: { [Op.iLike]: data.phoneNumber },
    };
    return Phone.findOne({
      where,
      attributes: ["phoneId", "phoneNumber"],
    });
  }

  static async getAllData(deleteResult: Boolean = false) {
    const where = deleteResult
      ? { deleteFlag: BaseModel.ACTIVE_DELETE_FLAG }
      : { deleteFlag: BaseModel.INACTIVE_DELETE_FLAG };

    return Phone.findAll({
      attributes: ["phoneId", "phoneNumber"],
      include: [
        {
          model: User,
          attributes: ["userId", "userName"],
        },
      ],
      where,
      order: [["phoneId", "DESC"]],
    });
  }

  static async getData(phoneId: string) {
    return Phone.findByPk(phoneId, {
      attributes: ["phoneId", "phoneNumber", "deleteFlag"],
      include: [
        {
          model: User,
          attributes: ["userId", "userName"],
        },
      ],
    });
  }

  static async addData(data: any) {
    const phoneExists = await this._exists(data);

    if (phoneExists) {
      return { error: "ALREADY_EXISTS" };
    }

    data.createdBy = global["userId"];
    data.updatedBy = global["userId"];

    let phone = new Phone(data);
    return phone.save();
  }

  static async updateData(data: any) {
    const phoneExists = await this._exists(data);

    if (phoneExists) {
      return { error: "ALREADY_EXISTS" };
    }
    data.updatedBy = global["userId"];

    const result = await Phone.update(data, {
      returning: true,
      where: { phoneId: data.phoneId },
    });
    return BaseModel.checkUpdate(result);
  }

  static async deleteData(phoneId: string) {
    const result = await Phone.update(
      {
        deleteFlag: BaseModel.INACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },
      { where: { phoneId } }
    );
    return result[0] && result[0] > 0;
  }

  static async restoreData(phoneId: string) {
    const result = await Phone.update(
      {
        deleteFlag: BaseModel.ACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },

      { where: { phoneId } }
    );
    return result[0] && result[0] > 0;
  }
}
