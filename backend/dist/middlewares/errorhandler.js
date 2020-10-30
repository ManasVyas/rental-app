"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const basecontroller_1 = require("../libs/basecontroller");
const exception_1 = require("../models/exception");
function ErrorHandler(err, req, res, next) {
    err.pathURL = req.path || "";
    err.stackTrace = Error().stack || "";
    exception_1.default.addException(err);
    res.status(500);
    if (err.name === "SequelizeDatabaseError") {
        res.json({
            errors: [
                {
                    attribute: "SequelizeDatabaseError",
                    message: err.toString(),
                    sql: err,
                },
            ],
            status: basecontroller_1.BaseController.ERROR_STATUS,
        });
    }
    else {
        if (err.attribute || !err.error) {
            res.json({ errors: err, status: basecontroller_1.BaseController.ERROR_STATUS });
        }
        else {
            res.json({
                errors: err.error.toString(),
                status: basecontroller_1.BaseController.ERROR_STATUS,
            });
        }
    }
}
exports.ErrorHandler = ErrorHandler;
