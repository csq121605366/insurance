import Router from "koa-router";
import { resolve } from "path";
import glob from "glob";
import config from "../config";
import R from "ramda";

export let routersMap = new Map();
export const symbolPrefix = Symbol("prefix");

// 格式化路径字符串
export const normalizePath = path => (path.startsWith("/") ? path : `/${path}`);

export default class Route {
  constructor(app, apiPath) {
    this.app = app;
    this.apiPath = apiPath;
    this.router = new Router();
  }
  init() {
    glob.sync(resolve(this.apiPath, "./*.js")).forEach(el => {
      require(el);
    });
    // 获得接口地址和控制器数组
    for (let [conf, controller] of routersMap) {
      const controllers = Array.isArray(controller) ? controller : [controller];
      let prefixPath = conf.target[symbolPrefix];
      if (prefixPath) prefixPath = normalizePath(prefixPath);
      // 接口前缀+接口分组+接口路径 = 接口地址
      const routerPath = config.apiPrefix + prefixPath + conf.path;
      console.log(conf.method, routerPath, controllers);
      // 下式相当于 this.router.[get||post||all](接口地址,控制器)
      this.router[conf.method](routerPath, ...controllers);
    }
   
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}

export const router = conf => (target, key, desc) => {
  conf.path = normalizePath(conf.path);
  routersMap.set(
    {
      target,
      ...conf
    },
    target[key]
  );
};

export const controller = path => target =>
  (target.prototype[symbolPrefix] = path);
export const get = path => router({ method: "get", path });
export const post = path => router({ method: "post", path });
export const all = path => router({ method: "all", path });

// 将中间件push到要修饰的方法上
const decorate = (args, middleware) => {
  let [target, key, descriptor] = args;
  // 要修饰的方法是不是数组 如果不是数组就变成数组
  target[key] = Array.isArray(target[key]) ? target[key] : [target[key]];
  // convert的中间件插入到要修饰的方法上
  target[key].unshift(middleware);
  return descriptor;
};

export const convert = middleware => (...args) => decorate(args, middleware);

// 定义判断类型的修饰器
export const required = rules =>
  convert(async (ctx, next) => {
    let errors = [];
    // rules:类似于{ body: ['code', 'productId', 'userInfo'] }
    // 或者{ query: ['code', 'userInfo'] }
    // 首先forEachObjIndexed遍历rules也就是传过来的参数
    //然后遍历rules然后filter出在ctx.request中不存在的值抛出键值对组成的值
    R.forEachObjIndexed((value, key) => {
      errors = R.filter(i => !R.has(i, ctx.request[key]))(value);
    })(rules);
    if (errors.length) ctx.throw(406, `${errors.join(",")} 参数缺失`);
    await next();
  });
