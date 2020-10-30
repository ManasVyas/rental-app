"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const BodyParser = require("body-parser");
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("../config");
class App {
    constructor() {
        this.init();
    }
    init() {
        this.server = Express();
        this.setMiddleWare();
        this.connectToDb();
    }
    setMiddleWare() {
        this.server.use(BodyParser.json());
        this.server.use(BodyParser.urlencoded({ extended: true }));
    }
    start(PORT) {
        this.performPreStart();
        this.server.listen(PORT, () => {
            console.log(`server is listening on port: ${PORT}`);
        });
        this.performPostStart();
    }
    performPreStart() { }
    performPostStart() { }
    connectToDb() {
        this.db = new sequelize_typescript_1.Sequelize({
            database: config_1.DBConfig.DATABASE,
            dialect: "postgres",
            dialectOptions: { ssl: config_1.DBConfig.DIALECT_SSL },
            host: config_1.DBConfig.HOST,
            username: config_1.DBConfig.USERNAME,
            password: config_1.DBConfig.PASSWORD,
            modelPaths: config_1.DBConfig.MODEL_PATH,
        });
        this.db.sync({ force: config_1.DBConfig.SYNC_FLAG });
    }
}
exports.default = new App();
