import { Sequelize } from "sequelize";
import { Column, Model } from "sequelize-typescript";
import App from "./app";

export class BaseModel<T = any> extends Model<T> {
  @Column({
    allowNull: false,
    defaultValue: BaseModel.ACTIVE_DELETE_FLAG,
    field: "delete_flag",
  })
  deleteFlag: string;

  @Column({
    allowNull: false,
    field: "created_by",
  })
  createdBy: number;

  @Column({
    allowNull: false,
    field: "updated_by",
  })
  updatedBy: number;

  @Column({
    allowNull: false,
    field: "created_at",
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  })
  createdAt: Date;

  @Column({
    allowNull: true,
    field: "updated_at",
  })
  updatedAt: Date;

  @Column({
    allowNull: true,
    field: "comment_desc",
  })
  comments: String;

  static ACTIVE_DELETE_FLAG = "A";
  static INACTIVE_DELETE_FLAG = "NA";
  static TRANSFER_DELETE_FLAG = "T";
  static NEXT_VALUE_EXCEPTION_MSG = "Not able to get next value from DB";
  static RECORD_NOT_FOUND_EXCEPTION_MSG = "Record not found with given ID!";
  static CREATED_AT = "created_at";
  static UPDATED_AT = "updated_at";

  static Validate(obj: any, requiredVals: Array<string>) {
    requiredVals.forEach((val: any) => {
      if (typeof obj[val] === "undefined") {
        throw `${val} is missing`;
      }
    });
  }

  static errorObject(attributes, message) {
    return [{ attributes, message }];
  }

  static checkUpdate(result) {
    if (result[0]) {
      return result[1];
    } else {
      return false;
    }
  }

  static getDelta(source, updated, pk: string) {
    let added = updated.filter(
      (updatedItem) =>
        source.find((sourceItem) => sourceItem[pk] === updatedItem[pk]) ===
        undefined
    );

    let changed = updated.filter(
      (updatedItem) =>
        source.find((sourceItem) => updatedItem[pk] === sourceItem[pk]) !==
        undefined
    );

    let deleted = source.filter(
      (sourceItem) =>
        updated.find((updatedItem) => updatedItem[pk] === sourceItem[pk]) ===
        undefined
    );

    const delta = {
      added,
      changed,
      deleted,
    };

    return delta;
  }

  static prepareChildren(
    data: any,
    childrenKey: string,
    isUpdate: Boolean = false
  ) {
    const { createdBy, updatedBy } = data;
    let childrenArr;

    if (isUpdate) {
      childrenArr = data[childrenKey].map((childrenData) => ({
        ...childrenData,
        updatedBy,
      }));
    } else {
      childrenArr = data[childrenKey].map((childrenData) => ({
        ...childrenData,
        createdBy,
        updatedBy,
      }));
    }
    data[childrenKey] = childrenArr;
  }

  static async performTransaction(callback) {
    return App.db.transaction(async (transaction) => {
      try {
        let data = await callback(transaction);
        return data;
      } catch (e) {
        console.error("TRANSACTION ERROR");
        console.error(e);
        await transaction.rollback();
      }
    });
  }

  static formatDate(date: string | number | Date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return `${year}-${month}-${day}`;
  }
}
