import { Table, Column, DataType } from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import { DBConfig } from "../config";

@Table({
  tableName: "exception_log",
  timestamps: true,
})
export default class Exception extends BaseModel<Exception> {
  static EXCEPTION_TYPE_UAM = "UAM";
  static EXCEPTION_UAM_MSG = "Unauthorized Access";

  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "exception_id",
  })
  exceptionId: number;

  @Column({
    allowNull: false,
    field: "log_type",
  })
  logType: string;

  @Column({
    allowNull: true,
    field: "path_url",
  })
  pathURL: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
    field: "exception_msg",
  })
  exceptionMsg: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
    field: "stack_trace",
  })
  stackTrace: string;

  static async addException(err) {
    let exceptionMsg;
    if (
      err["error"] !== undefined &&
      err["error"][0] !== undefined &&
      err["error"][0]["attribute"] !== undefined
    ) {
      exceptionMsg = err.error
        .map((e) => e.attribute + ": " + e.message)
        .join(",");
    } else if (err.error !== undefined && err.error.message !== undefined) {
      exceptionMsg = err.error.message.toString();
    }
    const type = err.error && err.error.name ? err.error.name : "Error";
    let exception = new Exception({
      logType: type,
      pathURL: err.pathURL,
      exceptionMsg: exceptionMsg,
      stackTrace: err.stackTrace,
      createdBy: global["userId"] ? global["userId"] : 0,
      updatedBy: global["userId"] ? global["userId"] : 0,
    });
    return exception.save() ? true : false;
  }
}
