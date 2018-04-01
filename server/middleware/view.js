import serve from 'koa-static';
import {resolve} from 'path'
export const view = app => {
    // 将页面指向view文件夹
    console.log(resolve(__dirname))
    app.use(serve(resolve(__dirname, "../view/")));
}