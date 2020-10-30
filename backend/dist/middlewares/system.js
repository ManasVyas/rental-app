"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserId = void 0;
exports.AddUserId = function (req, res, next) {
    let userId = req.header("UserId");
    if (userId) {
        global["userId"] = userId;
        next();
    }
    else {
        next();
    }
};
