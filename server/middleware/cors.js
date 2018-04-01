import cors from "koa2-cors";
import config from "../config";
// 实现跨域
export default app => {
  app.use(
    cors({
      origin: function(ctx) {
        if (config.corsOrigin.test(ctx.url)) {
          return config.corsRootUrl;
        }
        // 不允许来自所有域名请求
        return false;
      },
      exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
      maxAge: 5,
      credentials: true,
      allowMethods: ["GET", "POST", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization", "Accept"]
    })
  );
};
