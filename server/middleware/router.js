// 服务器api接口层

import Route from "../decorator";
import {resolve} from "path";
const r = path => resolve(__dirname, path);

export const router = app => {
  const apiPath = r('../routes')
  const route = new Route(app, apiPath);
  route.init();
};
