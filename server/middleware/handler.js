/**
 * 错误事件处理
 * 通过try catch 监听ctx.throw()发出的错误事件
 * 参数:ctx.throw(errorCode,[message,errorPageUrl])
 * errorCode:错误码 配置详见config中的code文件
 * message: 自定义错误信息，如果有就是自定义如果没有则是默认配置的信息
 * errorPageUrl：错误时重定向的地址，应为已经配置了history.js的中间件所以 没办法重定向这里解决方法是：
 * 向前端传递一个地址 让前端路由来控制
 */

import code from "../config/code";
import config from "../config";

export default app => {
  function koaRes(options = {}) {
    const custom = options.custom;
    if (custom && typeof custom !== "function") {
      throw new TypeError(
        "`custom` should be a function that return an object"
      );
    }
    return async (ctx, next) => {
      try {
        await next();
        // 如果定义不要格式化就直接返回body
        if (ctx.noformate) {
          // 微信接口使用
          return;
        }
        const status = ctx.status || 500;
        const data = ctx.body ? ctx.body : "出错了没body";
        if (ctx.method.toLowerCase !== "option" && status !== 404) {
          ctx.body = {
            code: 200,
            message: '操作成功',
            data: data,
            version: options.version || config.version || "1.0.0",
            now: new Date()
          };
          if (custom) {
            Object.assign(ctx.body, custom(ctx));
          }
          ctx.status = status;
        }
      } catch (e) {
        if (!e) return;
        if (401 == e.status) {
          ctx.status = 401;
          e.message = code[e.statusCode] || code[e.status] || "操作错误!";
        }
        ctx.body = {
          code: e.status || e.statusCode || 500,
          message:
            e.message || code[e.statusCode] || code[e.status] || "操作错误!",
          version: options.version || config.version || "1.0.0",
          now: new Date()
        };
        if (custom) {
          Object.assign(ctx.body, custom(ctx));
        }
        if (options.debug) {
          Object.assign(ctx.body, {
            stack: e.stack || e
          });
        }
      }
    };
  }
  app.use(koaRes({ debug: true }));
};
