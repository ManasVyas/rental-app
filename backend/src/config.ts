import * as path from "path";

export const DBConfig = {
  HOST: "localhost",
  DATABASE: "rentalapp",
  USERNAME: "postgres",
  PASSWORD: "root",
  MODEL_PATH: [path.resolve(__dirname, "./models")],
  MODEL_TO_BE_SYNC: [],
  DIALECT_SSL: false,
  SYNC_FLAG: false,
};
