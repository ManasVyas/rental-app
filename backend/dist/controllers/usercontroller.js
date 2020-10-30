"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const basecontroller_1 = require("../libs/basecontroller");
const user_1 = require("../models/user");
class UserController extends basecontroller_1.BaseController {
    async getAllData(req, res, next) {
        try {
            let data = await user_1.default.getAllData(req.params.activeFlag === "1");
            res.json({ data, status: basecontroller_1.BaseController.SUCCESS_STATUS });
        }
        catch (e) {
            next({ status: basecontroller_1.BaseController.ERROR_STATUS, error: e });
        }
    }
    async getData(req, res, next) {
        try {
            let data = await user_1.default.getData(req.params.userId);
            res.json({ data, status: basecontroller_1.BaseController.SUCCESS_STATUS });
        }
        catch (e) {
            next({ status: basecontroller_1.BaseController.ERROR_STATUS, error: e });
        }
    }
    async addData(req, res, next) {
        try {
            let data = await user_1.default.addData(req.body);
            if (data["error"] === "ALREADY_EXISTS") {
                res.status(400).json({
                    data: [],
                    status: basecontroller_1.BaseController.ERROR_STATUS,
                    message: UserController.USER_ALREADY_EXISTS_EXCEPTION_MSG,
                });
            }
            else {
                res.json({ data, status: basecontroller_1.BaseController.SUCCESS_STATUS });
            }
        }
        catch (e) {
            next({ status: basecontroller_1.BaseController.ERROR_STATUS, error: e });
        }
    }
    async updateData(req, res, next) {
        try {
            let data = await user_1.default.updateData(req.body);
            res.json({ data, status: basecontroller_1.BaseController.SUCCESS_STATUS });
        }
        catch (e) {
            next({ status: basecontroller_1.BaseController.ERROR_STATUS });
        }
    }
    async deleteData(req, res, next) {
        try {
            let data = await user_1.default.deleteData(req.params.userId);
            res.json({ data, status: basecontroller_1.BaseController.SUCCESS_STATUS });
        }
        catch (e) {
            next({ status: basecontroller_1.BaseController.ERROR_STATUS });
        }
    }
    async restoreData(req, res, next) {
        try {
            let data = await user_1.default.restoreData(req.params.userId);
            res.json({ data, status: basecontroller_1.BaseController.SUCCESS_STATUS });
        }
        catch (e) {
            next({ status: basecontroller_1.BaseController.ERROR_STATUS });
        }
    }
}
exports.UserController = UserController;
UserController.USER_ALREADY_EXISTS_EXCEPTION_MSG = "User already exists!";
