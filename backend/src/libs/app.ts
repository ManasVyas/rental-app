import * as Express from "express";
import * as BodyParser from "body-parser";
import { Sequelize } from "sequelize-typescript";
import { DBConfig } from "../config";
import * as path from "path";

class App {
  public server: Express.Application;
  db: Sequelize;

  constructor() {
    this.init();
  }

  private init() {
    this.server = Express();
    this.setMiddleWare();
    this.connectToDb();
  }

  private setMiddleWare() {
    this.server.use(BodyParser.json());
    this.server.use(BodyParser.urlencoded({ extended: true }));
  }

  start(PORT: string) {
    this.performPreStart();
    this.server.listen(PORT, () => {
      console.log(`server is listening on port: ${PORT}`);
    });
    this.performPostStart();
  }

  private performPreStart() {}

  private performPostStart() {}

  public connectToDb() {
    this.db = new Sequelize({
      database: DBConfig.DATABASE,
      dialect: "postgres",
      dialectOptions: { ssl: DBConfig.DIALECT_SSL },
      host: DBConfig.HOST,
      username: DBConfig.USERNAME,
      password: DBConfig.PASSWORD,
      modelPaths: DBConfig.MODEL_PATH,
      // modelMatch: (filename, member) => {
      //   console.log(filename);
      //   return (filename = member.toLowerCase());
      // },
    });
    this.db.sync({ force: DBConfig.SYNC_FLAG });
  }
}

export default new App();
