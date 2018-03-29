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

export default app => {
  const handler = async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err);
      ctx.response.status =
        typeof err === "number" ? err : err.statusCode || err.status || 500;
      ctx.response.body = {
        message: err.message || code[statusCode] || code[status] || "操作错误!",
        errorPageUrl: err.errorPageUrl || false
      };
      // if(err.errorPageUrl){
      //   ctx.redirect(errorPageUrl)
      // }
    }
  };
  app.use(handler);
};
