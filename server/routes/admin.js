import UserController from "../controllers/user";
import { controller, get, post, all,required } from "../decorator";

@controller("user")
export class user {

  @post("login")
  @required({body:['username','password']})
  async POST_login(ctx, next) {
    await UserController.signIn(ctx, next);
  }

  @post("login2")
  @required({body:['username2','password2']})
  async POST_login2(ctx, next) {
    await UserController.signIn(ctx, next);
  }

}
