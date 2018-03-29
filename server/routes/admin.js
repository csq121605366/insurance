import { admin } from "../controllers/admin";
import { controller, get, post, all } from "../decorator/route";

@controller("user")
export class user {
  @post("login")
  async POST_login(ctx, next) {
    ctx.throw(500, "未找到", { redirect: true });
    await login(ctx, next);
  }
}
