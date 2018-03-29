// 用户控制器原型
import mongoose from "mongoose";

let User = mongoose.model("User");

export default class {
  constructor() {
    this.User = User;
  }
}
