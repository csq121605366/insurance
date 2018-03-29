import koaBody from 'koa-bodyparser';
import session from 'koa-session';
import config from '../config';

export const addBody = app => {
    app.use(koaBody());
}
export const addBody = app => {
    const conf = {
        key: config.sessionKey,
        maxAge: config.sessionMaxAge
    }
    app.use(session(conf, app));
}