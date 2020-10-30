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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const basemodel_1 = require("../libs/basemodel");
let User = User_1 = class User extends basemodel_1.BaseModel {
    static async _exists(data) {
        const where = {
            userName: { [sequelize_1.Op.iLike]: data.userName },
        };
        return User_1.findOne({ where, attributes: ["userId", "userName"] });
    }
    static async getAllData(deleteResult = false) {
        const where = deleteResult
            ? { deleteFlag: basemodel_1.BaseModel.ACTIVE_DELETE_FLAG }
            : { deleteFlag: basemodel_1.BaseModel.INACTIVE_DELETE_FLAG };
        return User_1.findAll({
            attributes: ["userId", "userName", "deleteFlag"],
            where,
            order: [["userId", "DESC"]],
        });
    }
    static async getData(userId) {
        return User_1.findByPk(userId, {
            attributes: [
                "userId",
                "userName",
                "createdBy",
                "updatedBy",
                "deleteFlag",
            ],
        });
    }
    static async addData(data) {
        const userExists = await this._exists(data);
        if (userExists) {
            return { error: "ALREADY_EXISTS" };
        }
        // data.createdBy = global["userId"];
        // data.updatedBy = global["userId"];
        let user = new User_1(data);
        return user.save();
    }
    static async updateData(data) {
        // data.updatedBy = global["userId"];
        const result = await User_1.update(data, {
            returning: true,
            where: { userId: data.userId },
        });
        return basemodel_1.BaseModel.checkUpdate(result);
    }
    static async deleteData(userId) {
        const result = await User_1.update({
            deleteFlag: basemodel_1.BaseModel.INACTIVE_DELETE_FLAG,
            updatedBy: userId,
        }, { where: { userId } });
        return result[0] && result[0] > 0;
    }
    static async restoreData(userId) {
        const result = await User_1.update({
            deleteFlag: basemodel_1.BaseModel.ACTIVE_DELETE_FLAG,
            updatedBy: userId,
        }, { where: { userId } });
        return result[0] && result[0] > 0;
    }
};
__decorate([
    sequelize_typescript_1.Column({
        primaryKey: true,
        autoIncrement: true,
        field: "user_id",
    }),
    __metadata("design:type", Number)
], User.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        field: "user_name",
    }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
User = User_1 = __decorate([
    sequelize_typescript_1.Table({
        tableName: "user",
        timestamps: true,
    })
], User);
exports.default = User;
