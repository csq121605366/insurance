// 对connect-history-api-fallback进行封装
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
