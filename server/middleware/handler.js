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
    }
  };
  app.use(handler);
};
