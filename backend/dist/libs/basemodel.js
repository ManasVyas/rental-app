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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const app_1 = require("./app");
class BaseModel extends sequelize_typescript_1.Model {
    static Validate(obj, requiredVals) {
        requiredVals.forEach((val) => {
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
        }
        else {
            return false;
        }
    }
    static getDelta(source, updated, pk) {
        let added = updated.filter((updatedItem) => source.find((sourceItem) => sourceItem[pk] === updatedItem[pk]) ===
            undefined);
        let changed = updated.filter((updatedItem) => source.find((sourceItem) => updatedItem[pk] === sourceItem[pk]) !==
            undefined);
        let deleted = source.filter((sourceItem) => updated.find((updatedItem) => updatedItem[pk] === sourceItem[pk]) ===
            undefined);
        const delta = {
            added,
            changed,
            deleted,
        };
        return delta;
    }
    static prepareChildren(data, childrenKey, isUpdate = false) {
        const { createdBy, updatedBy } = data;
        let childrenArr;
        if (isUpdate) {
            childrenArr = data[childrenKey].map((childrenData) => (Object.assign(Object.assign({}, childrenData), { updatedBy })));
        }
        else {
            childrenArr = data[childrenKey].map((childrenData) => (Object.assign(Object.assign({}, childrenData), { createdBy,
                updatedBy })));
        }
        data[childrenKey] = childrenArr;
    }
    static async performTransaction(callback) {
        return app_1.default.db.transaction(async (transaction) => {
            try {
                let data = await callback(transaction);
                return data;
            }
            catch (e) {
                console.error("TRANSACTION ERROR");
                console.error(e);
                await transaction.rollback();
            }
        });
    }
    static formatDate(date) {
        let d = new Date(date), month = "" + (d.getMonth() + 1), day = "" + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = "0" + month;
        if (day.length < 2)
            day = "0" + day;
        return `${year}-${month}-${day}`;
    }
}
BaseModel.ACTIVE_DELETE_FLAG = "A";
BaseModel.INACTIVE_DELETE_FLAG = "NA";
BaseModel.TRANSFER_DELETE_FLAG = "T";
BaseModel.NEXT_VALUE_EXCEPTION_MSG = "Not able to get next value from DB";
BaseModel.RECORD_NOT_FOUND_EXCEPTION_MSG = "Record not found with given ID!";
BaseModel.CREATED_AT = "created_at";
BaseModel.UPDATED_AT = "updated_at";
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        defaultValue: BaseModel.ACTIVE_DELETE_FLAG,
        field: "delete_flag",
    }),
    __metadata("design:type", String)
], BaseModel.prototype, "deleteFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        field: "created_by",
    }),
    __metadata("design:type", Number)
], BaseModel.prototype, "createdBy", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        field: "updated_by",
    }),
    __metadata("design:type", Number)
], BaseModel.prototype, "updatedBy", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        field: "created_at",
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    }),
    __metadata("design:type", Date)
], BaseModel.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        field: "updated_at",
    }),
    __metadata("design:type", Date)
], BaseModel.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        field: "comment_desc",
    }),
    __metadata("design:type", String)
], BaseModel.prototype, "comments", void 0);
exports.BaseModel = BaseModel;
