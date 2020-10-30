"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowCrossDomain = void 0;
exports.AllowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, userid");
    next();
};
