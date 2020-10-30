"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Exception_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const basemodel_1 = require("../libs/basemodel");
let Exception = Exception_1 = class Exception extends basemodel_1.BaseModel {
    static async addException(err) {
        let exceptionMsg;
        if (err["error"] !== undefined &&
            err["error"][0] !== undefined &&
            err["error"][0]["attribute"] !== undefined) {
            exceptionMsg = err.error
                .map((e) => e.attribute + ": " + e.message)
                .join(",");
        }
        else if (err.error !== undefined && err.error.message !== undefined) {
            exceptionMsg = err.error.message.toString();
        }
        const type = err.error && err.error.name ? err.error.name : "Error";
        let exception = new Exception_1({
            logType: type,
            pathURL: err.pathURL,
            exceptionMsg: exceptionMsg,
            stackTrace: err.stackTrace,
            createdBy: global["userId"] ? global["userId"] : 0,
            updatedBy: global["userId"] ? global["userId"] : 0,
        });
        return exception.save() ? true : false;
    }
};
Exception.EXCEPTION_TYPE_UAM = "UAM";
Exception.EXCEPTION_UAM_MSG = "Unauthorized Access";
__decorate([
    sequelize_typescript_1.Column({
        primaryKey: true,
        autoIncrement: true,
        field: "exception_id",
    }),
    __metadata("design:type", Number)
], Exception.prototype, "exceptionId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        field: "log_type",
    }),
    __metadata("design:type", String)
], Exception.prototype, "logType", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        field: "path_url",
    }),
    __metadata("design:type", String)
], Exception.prototype, "pathURL", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        type: sequelize_typescript_1.DataType.TEXT,
        field: "exception_msg",
    }),
    __metadata("design:type", String)
], Exception.prototype, "exceptionMsg", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        type: sequelize_typescript_1.DataType.TEXT,
        field: "stack_trace",
    }),
    __metadata("design:type", String)
], Exception.prototype, "stackTrace", void 0);
Exception = Exception_1 = __decorate([
    sequelize_typescript_1.Table({
        tableName: "exception_log",
        timestamps: true,
    })
], Exception);
exports.default = Exception;
