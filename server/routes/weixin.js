import WeixinController from "../controllers/weixin";
import { controller, get, post, all, required } from "../decorator";

@controller("weixin")
export class weixinRouter {
  constructor() {}

  @all("hear")
  async ALL_wechatHear(ctx, next) {
    ctx.noformate = true;
    await WeixinController.wechatHear(...arguments);
  }

  @get("signature")
  @required({ query: ["url"] })
  async GET_wechatSignature(ctx, next) {
    ctx.noformate = true;
    await WeixinController.signature(...arguments);
  }

  @get("redirect")
  async GET_wechatRedirect(ctx, next) {
    ctx.noformate = true;
    await WeixinController.redirect(...arguments);
  }

  @get("oauth")
  async GET_wechatOauth(ctx, next) {
    ctx.noformate = true;
    await WeixinController.oauth(...arguments);
  }
}

