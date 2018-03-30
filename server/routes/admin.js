import User from "../controllers/user";
import { controller, get, post, all } from "../decorator/route";

@controller("user")
export class user {
  @post("login")
  async POST_login(ctx, next) {
    await User.signIn(ctx, next);
  }
}
