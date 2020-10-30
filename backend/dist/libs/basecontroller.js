"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    setReqMethod(methodName) {
        if (typeof this[methodName] != "undefined") {
            return this[methodName].bind(this);
        }
        else {
            throw `Invalid ${methodName} Method name provided, please check your controller`;
        }
    }
}
exports.BaseController = BaseController;
BaseController.SUCCESS_STATUS = "success";
BaseController.ERROR_STATUS = "error";
