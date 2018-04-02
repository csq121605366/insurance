import AdminController from "../controllers/admin";
import { controller, get, post, all, required } from "../decorator";

@controller("admin")
export class AdminRouter {

  @post("login")
  @required({ body: ["username", "password"] })
  //logintype 表示登录类型1：用户名密码登录 2手机登录
  async POST_login(ctx, next) {
    await AdminController.login(...arguments);
  }

  @post("logout")
  @required({ body: ["username"] })
  async POST_logout(ctx, next) {
    await AdminController.logout(...arguments);
  }

  @post("register")
  @required({ body: ["username", "password"] })
  async POST_sendEmail(ctx, next) {
    await AdminController.register(...arguments);
  }

  // @post("register")
  // @required({ body: ["username", "password", "phoneNumber"] })
  // async POST_register(ctx, next) {
  //   await AdminController.register(...arguments);
  // }
}

