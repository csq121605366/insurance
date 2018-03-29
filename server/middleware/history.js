/** 
 * 对connect-history-api-fallback进行封装
 * https://www.npmjs.com/package/connect-history-api-fallback
 * 主要作用是支持前端route的history模式 将所有html请求重定向到index.html(插件默认页面也可以自己设置)
 * 此插件必须放在静态资源插件的前面才可以控制
 */

import connect from 'connect-history-api-fallback';

const middleware = connect({
    // verbose: true, //打印转发日志
    htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
})

export const history = (app) => {
    app.use(async(ctx, next) => {
        middleware(ctx, null, ()=>{});
        await next();
    });
};
