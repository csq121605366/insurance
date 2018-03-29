import Koa from "koa";
import config from "./config";
import { resolve } from "path";
import R from "ramda";

const r = path => resolve(__dirname, path);

/**
 * (logger控制台打印日志)
 * (handler错误处理handler)
 * (database解决数据库插件)
 * (history解决spa项目路由指向的插件)
 * (view解决静态资源视图)
 * (cors解决跨域)
 * (router路由)
 * 顺序不能变
 */

const MIDDLEWARE = [
  "database",
  "logger",
  "handler",
  "history",
  "view",
  "cors",
  "router"
];
const app = new Koa();

const useMiddleware = app => {
  // 中间件的个数不定，通过 Ramda 的特性，从右往左进行函数组合，右侧函数的返回结果总是左侧函数的输入参数 R.map(console.log)([1,
  // 2, 3]) MIDDLEWARE 数组交给了 R.map 分别拿到的单个数组中的值，我们可以通过 R.compose 再次进行组合。
  return R.map(
    R.compose(R.map(i => i(app)), require, i => `${r("./middleware")}/${i}`)
  );
};

const start = async () => {
  // 使用historyApi app.use(history({   verbose: true //打印转发日志 })) 调用中间件
  await useMiddleware(app)(MIDDLEWARE);
  // 监听端口
  app.listen(config.port, config.host);
  console.log("Server listening on " + config.host + ":" + config.port);
};

start();
