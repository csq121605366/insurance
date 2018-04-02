import serve from 'koa-static';
import {resolve} from 'path'
export const view = app => {
    // 将页面指向view文件夹
    app.use(serve(resolve(__dirname, "../view/")));
}