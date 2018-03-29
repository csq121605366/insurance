import mongoose from "mongoose";
import config from "../config";
import fs from "fs";
import {resolve} from "path";

const models = resolve(__dirname, "../database/schema");
fs
  .readdirSync(models)
  .filter(file => ~ file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)));

console.log(config.mongodb)
const connect = () => mongoose.connect(config.mongodb, {
  config: {
    autoIndex: true
  }
});



export const database = app => {
  mongoose.set("debug", false);
  mongoose.Promise = global.Promise;
  connect();
  mongoose
    .connection
    .on("disconnected", () => {
      console.log('连接数据库失败!');
      setTimeout(() => {
        connect();
      }, 500);
    });

  mongoose
    .connection
    .on("error", err => {
      console.error(err);
    });
  mongoose
    .connection
    .on("open", async => {
      console.log("Connected to MongoDB");
    });
};
