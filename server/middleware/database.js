import mongoose from "mongoose";
import config from "../config";
import fs from "fs";
import { resolve } from "path";

const models = resolve(__dirname, "../database/model");
fs
  .readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => {
    require(resolve(models, file))
  });

const connect = async () =>
  await mongoose.connect(config.mongodb, {
    config: {
      autoIndex: true
    }
  });

export default async app => {

  mongoose.set("debug", false);
  mongoose.Promise = global.Promise;
  connect();

  // 初始化数据
  let Admin = mongoose.model('Admin');
  let find = await Admin.findOne({
    username: "caishangqing"
  }).exec();
  if (!find) {
    await new Admin({
      username: "caishangqing",
      password: "123456"
    }).save()
  }

  mongoose.connection.on("disconnected", () => {
    console.log("连接数据库失败!");
    connect();
  });

  mongoose.connection.on("error", err => {
    console.error(err);
  });
  mongoose.connection.on("open", async => {
    console.log("Connected to MongoDB");
  });
};

