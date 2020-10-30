import { Op } from "sequelize";
import { Column, HasMany, Table } from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import ProductLocation from "./productlocation";

@Table({
  tableName: "location",
  timestamps: true,
})
export default class Location extends BaseModel<Location> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "location_id",
  })
  locationId: number;

  @Column({
    allowNull: false,
    field: "name",
  })
  name: string;

  @HasMany(() => ProductLocation)
  productLocations: ProductLocation[];

  static async _exists(data: any) {
    const where = {
      name: { [Op.iLike]: data.name },
    };
    return Location.findOne({
      where,
      attributes: ["locationId", "name"],
    });
  }

  static async getAllData(deleteResult: Boolean = false) {
    const where = deleteResult
      ? { deleteFlag: BaseModel.ACTIVE_DELETE_FLAG }
      : { deleteFlag: BaseModel.INACTIVE_DELETE_FLAG };

    return Location.findAll({
      attributes: ["locationId", "name", "deleteFlag"],
      where,
      order: [["locationId", "DESC"]],
    });
  }

  static async getData(locationId: string) {
    return Location.findByPk(locationId, {
      attributes: ["locationId", "name", "deleteFlag"],
    });
  }

  static async addData(data: any) {
    const locationExists = await this._exists(data);

    if (locationExists) {
      return { error: "ALREADY_EXISTS" };
    }

    data.createdBy = global["userId"];
    data.updatedBy = global["userId"];

    let location = new Location(data);
    return location.save();
  }

  static async updateData(data: any) {
    const locationExists = await this._exists(data);

    if (locationExists) {
      return { error: "ALREADY_EXISTS" };
    }
    data.updatedBy = global["userId"];

    const result = await Location.update(data, {
      returning: true,
      where: { locationId: data.locationId },
    });
    return BaseModel.checkUpdate(result);
  }

  static async deleteData(locationId: string) {
    const result = await Location.update(
      {
        deleteFlag: BaseModel.INACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },
      { where: { locationId } }
    );
    return result[0] && result[0] > 0;
  }

  static async restoreData(locationId: string) {
    const result = await Location.update(
      {
        deleteFlag: BaseModel.ACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },

      { where: { locationId } }
    );
    return result[0] && result[0] > 0;
  }
}
