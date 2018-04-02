import koaBody from "koa-bodyparser";
import session from 'koa-session';
import config from '../config';

export const addBody = app => {
  app.use(koaBody());
};

export const addSession = app => {
  // 这里加密密钥
  app.keys = [config.cookieKeys];

  const CONFIG = {
    key: config.sessionKey,
    maxAge: config.sessionMaxAge,
    overwrite: true,
    signed: true,
    rolling: false,
  }

  app.use(session(CONFIG, app))
}
