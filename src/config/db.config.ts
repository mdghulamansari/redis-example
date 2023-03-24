import * as dotEnv from "dotenv";
dotEnv.config();

import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import path from "path";

const sequelize = new Sequelize({
  database: process.env.DATABASE_NAME,
  dialect: process.env.DATABASE_DIALECT as Dialect,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  models: [path.join(__dirname, "..", "models")],
  logging: false,
});

export default sequelize;
