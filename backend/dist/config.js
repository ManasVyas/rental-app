"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConfig = void 0;
const path = require("path");
exports.DBConfig = {
    HOST: "localhost",
    DATABASE: "myapp",
    USERNAME: "postgres",
    PASSWORD: "root",
    MODEL_PATH: [path.resolve(__dirname, "./models")],
    MODEL_TO_BE_SYNC: [],
    DIALECT_SSL: false,
    SYNC_FLAG: false,
};
