import UserController from "../controllers/user";
import { controller, get, post, all, required } from "../decorator";

@controller("/user")
export class UserRouter {
  @post("getToken")
  @required({ body: ["username", "password"] })
  async POST_login(ctx, next) {
    await UserController.getToken(...arguments);
  }

  @post("getUserinfo")
  @required({ body: ["username"] })
  async POST_getUserInfo(ctx, next) {
    await UserController.getUserInfo(...arguments);
  }

  @post("register")
  @required({ body: ["username", "password", "phoneNumber"] })
  async POST_register(ctx, next) {
    await UserController.register(...arguments);
  }
}

