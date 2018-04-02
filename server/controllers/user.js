import UserModel from "../database/model/user";
import jwt from "jsonwebtoken";
import config from "../config";
import R from "ramda";

class UserController {
  constructor() { }

  /**
   * 登录业务操作
   */
  async getToken(ctx, next) {
    let find,
      match,
      canLogin,
      formData = ctx.request.body;
    find = await UserModel.findOne({ username: formData.username }).exec();
    if (find) {
      // 如果没有被锁
      find.incLoginAttempts();
      if (!find.isLocked) {
        await find
          .comparePassword(formData.password, find.password)
          .then(() => {
            let token = this.setToken(find);
            ctx.body = { data: { token } };
          })
          .catch(() => {
            ctx.throw(406, "密码错误");
          });
      } else {
        ctx.throw(404, "尝试登录次数太多,账号已被锁");
      }
    } else {
      ctx.throw(404, "账号未找到");
    }
  }
  setToken(user) {
    let token = jwt.sign(
      {
        username: user.username,
        role: user.role,
        createTime: Date.now(),
        expiresIn: config.tokenExpiresIn
      },
      config.tokenSecret,
      { expiresIn: config.tokenExpiresIn }
    );
    return token;
  }

  async getUserInfo(ctx, next) {
    let find,
      formData = ctx.request.body,
      token = ctx.state.user;
    find = await UserModel.findOne({ username: formData.username })
      .select("-password -loginAttempts -lockUntil -meta")
      .exec();
    console.log(find);
    ctx.body = { data: find };
  }

  async register(ctx, next) {
    let find,
      formData = ctx.request.body;
    find = await UserModel.findOne({ username: formData.username }).exec();
    if (!find) {
      await new UserModel(formData)
        .save()
        .then(res => {
          ctx.body = {
            message: "创建成功",
            username: res.username
          };
        })
        .catch(err => {
          ctx.throw(406, R.keys(err.errors).join(" ") + " 格式错误");
        });
    } else {
      ctx.throw(406, "用户名已存在");
    }
  }
}

export default new UserController();
