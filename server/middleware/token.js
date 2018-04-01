import jwtKoa from "koa-jwt";
import config from "../config";

export const token = app => {
  app.use(
    jwtKoa({ secret: config.tokenSecret }).unless({
      path: [
        /^\/api\/user\/getToken$/,
        /^\/api\/user\/register$/,
        /^\/api\/weixin\/.*$/
      ]
    })
  );
};

export const weixin = app => {
  app.use(async (ctx, next) => {
    let user = ctx.state.user;
    if (/^\/api\/admin\/.*$/.test(ctx.path)) {
      if (user.role === "admin") {
        await next();
      } else {
        ctx.throw(401, "你不是管理员，没有权限！哼😒");
      }
    } else {
      await next();
    }
  });
};
