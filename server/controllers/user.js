import UserModel from "../database/model/user";

class User {
  constructor() {}

  /**
   * 登录业务操作
   */
  async signIn(ctx, next) {
    let formData = ctx.request.body;
    if (!formData.username || !formData.password) {
      ctx.throw(406);
    } else {
      this.signInByUserName(ctx, next, formData);
    }
  }
  /**
   * 通过账号密码登录
   */
  async signInByUserName(ctx, next, formData) {
    let user, match;
    try {
      user = await UserModel.findOne({ username: formData.username }).exec();
      if (user) {
        match = await UserModel.comparePassword(password, formData.password);
        if (match) {
          ctx.throw(400, "密码错误");
        } else {
          ctx.body = {
            success: 200,
            data: { 1: 2 }
          };
        }
      } else {
        ctx.throw(404, "账号未找到");
      }
    } catch (err) {
      ctx.throw(500);
    }
  }
}

export default new User();
