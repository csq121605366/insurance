import Router from 'koa-router';
import {resolve} from 'path';
import glob from 'glob';
import config from '../config';

export let routersMap = new Map();
export const symbolPrefix = Symbol('prefix');

// 格式化路径字符串
export const normalizePath = path => path.startsWith('/')
  ? path
  : `/${path}`;

export default class Route {
  constructor(app, apiPath) {
    this.app = app;
    this.apiPath = apiPath;
    this.router = new Router();
  }
  init() {
    glob
      .sync(resolve(this.apiPath, './*.js'))
      .forEach((el) => {
        require(el)
      });
    // 获得接口地址和控制器数组
    for (let [conf,
      controller]of routersMap) {
      const controllers = Array.isArray(controller)
        ? controller
        : [controller];
      let prefixPath = conf.target[symbolPrefix]
      if (prefixPath) 
        prefixPath = normalizePath(prefixPath)
        // 接口前缀+接口分组+接口路径 = 接口地址
      const routerPath = config.apiPrefix + prefixPath + conf.path;
      console.log(routerPath)
      // 下式相当于 this.router.[get||post||all](接口地址,控制器)
      this.router[conf.method](routerPath, ...controllers)
    }
    this
      .app
      .use(this.router.routes())
    this
      .app
      .use(this.router.allowedMethods());
  }
}

export const router = conf => (target, key, desc) => {
  conf.path = normalizePath(conf.path)
  routersMap.set({
    target,
    ...conf
  }, target[key])
}

export const controller = path => target => target.prototype[symbolPrefix] = path

export const get = path => router({method: 'get', path})
export const post = path => router({method: 'post', path})
export const all = path => router({method: 'all', path})