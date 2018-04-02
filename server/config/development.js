export default {
  mongodb: "mongodb://insurance_admin:csqcsq1214@47.52.63.21:27017/insurance",
  port: 8080,
  base: "http://localhost:8080",
  SITE_ROOT_URL: "http://localhost:8080",
  tokenSecret: "insurance:token", //token加密密钥
  tokenExpiresIn: "1h", //token最大生命值
  tokenGetUrlRegExp: new RegExp(/^\/api\/user\/getToken$/),
  apiPrefix: "/api", // apiPrefix：api接口前缀
  corsOrigin: new RegExp(/^\/api/), // corsOrigin：跨域匹配
  corsRootUrl: "http://localhost:8080",
  ngrok: "代理的 ngrok id",
  verion: "1.0.0",
  wechat: {
    refreshTime: { hour: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23] }, //每天定时更新access_token
    appID: "wxdb0b987716f5cc54",
    appSecret: "40eb0adc05b563a5bbbad3c44b5d0276",
    token: "weixin"
  },
  qiniu: {
    AK: "你的七牛 AK",
    SK: "你的七牛 SK",
    bucket: "你的七牛 bucket",
    qiniuURL: "bucket 对应的测试地址"
  }
};
