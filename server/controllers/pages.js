import request from "request-promise";

let baseUrl = "http://rap2api.taobao.org/app/mock/8528";

export async function api(ctx, next) {
  // let url = ctx
  //   .path
  //   .replace("/api", "/GET");
  // await request({
  //   url: baseUrl + url
  // }).then(res => {
  //   ctx.body = JSON.parse(res);
  // }).catch(err => {
  //   ctx.body = {
  //     code: 0,
  //     data: "数据加载错误"
  //   };
  // });
}
