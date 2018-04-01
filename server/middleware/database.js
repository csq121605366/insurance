import mongoose from "mongoose";
import config from "../config";
import fs from "fs";
import { resolve } from "path";

const models = resolve(__dirname, "../database/model");
fs
  .readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)));

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

  // // 创建第一条数据
  // const User = mongoose.model("User");
  // let user = await User.findOne({
  //   username: "caishangqing"
  // }).exec();
  // if (!user) {
  //   await new User({
  //     username: "caishangqing",
  //     password: "123456",
  //     role: "admin"
  //   }).save();
  // }

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
