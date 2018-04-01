import weixinProtoType from "./prototype/weixinProtoType";
// url格式转化
import { parse as urlParse } from "url";
import { parse as queryParse } from "querystring";
import sha1 from "sha1";
import getRawBody from "raw-body";
// // 配置
import config from "../config";
// // 微信依赖
// import WechatLib from "../util/wechat-lib";
// // 微信认证
import wechatOAuth from "../util/oauth";
// // 工具函数
import * as util from "../util/common";
// // 回复策略
import reply from "../util/reply";

class weixinController extends weixinProtoType {
  constructor() {
    super();
  }

  /**
   * 微信端监听处理
   * 1. 获取access_token
   * 2. 验证请求类型
   * 3. 解析请求参数
   */
  async wechatHear(ctx, next) {
    const { token } = config.wechat;
    const { signature, nonce, timestamp, echostr } = ctx.query;
    let str = [token, timestamp, nonce].sort().join("");
    let sha = sha1(str);
    console.log(sha == signature, ctx);
    if (ctx.method === "GET") {
      if (sha === signature) {
        /**
         * 开发者通过检验signature对请求进行校验（下面有校验方式）。
         * 若确认此次GET请求来自微信服务器
         * 请原样返回echostr参数内容，则接入生效，
         * 成为开发者成功，否则接入失败。
         */
        ctx.body = echostr;
        return;
      } else {
        return ctx.throw(400);
      }
    } else if (ctx.method === "POST") {
      if (sha !== signature) {
        return ctx.throw(400);
      }
    }
    // 解析请求参数1
    let data;
    await getRawBody(ctx.req, {
      length: ctx.length,
      limit: "1mb",
      encoding: ctx.charset
    })
      .then(string => {
        data = string;
      })
      .catch(err => {
        ctx.throw("raw-body解析错误");
      });
    // 解析xml
    let content;
    await util
      .parseXML(data)
      .then(res => {
        content = res;
      })
      .catch(err => {
        ctx.throw(400, "util.parseXML方法错误");
      });
    // 格式化信息
    let message = util.formatMessage(content.xml);
    // 将微信内容挂在ctx上
    ctx.weixin = message;
    // 根据信息制定回复策略
    await reply.apply(ctx, [ctx, next]);
    // 返回信息
    let replyBody = ctx.body;
    // 将消息封装在xml中
    let xml = util.template(replyBody, ctx.weixin);
    ctx.status = 200;
    ctx.type = "application/xml";
    // 返回给微信服务器
    ctx.body = xml;
  }

  /**
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
   * 微信签名认证 微信中网页获取签名使用
   */
  async signature(ctx, next) {
    let url = decodeURIComponent(ctx.query.url);
    let params = await this.getSignatureAsync(url);
    ctx.body = {
      success: true,
      params
    };
  }

  /**
   * 同步获取签名
   * @param {*} url 
   */
  async getSignatureAsync(url) {
    // 获取token
    let data = await this.fetchToken();
    let token = data.data;
    // 获取ticket
    let ticketData = await this.fetchToken("ticket");
    let ticket = ticketData.data;
    // 签名
    let params = this.sign(ticket, url);
    params.appId = this.appID;
    return params;
  }

  /**
   * 获取权限地址 
   * @param {*} args 
   */
  getAuthorizeURL(...args) {
    let getOAuth = getOAuth();
    return getOAuth.getAuthorizeURL(...args);
  }
  /**
   * 
   * @param {*} code 
   */
  async getUserByCode(code) {
    let getOAuth = this.getOAuth();
    let data = await this.fetchToken(code);
    let user = await this.getUserInfo(data.access_token, data.openid);
    return user;
  }

  /**
   * 微信获取oauth 用来获取用户资料 然后跳转到自己的网页
   * @param {*} ctx 
   * @param {*} next 
   */
  async oauth(ctx, next) {
    let url = decodeURIComponent(ctx.query.url)
    console.log(url);
    let urlObj = urlParse(url);
    console.log('urlObj',urlObj)
    let params = queryParse(urlObj.query);
    console.log('params',params)
    return false;
    let code = params.code;
    let user = await getUserByCode(code);
    console.log("url:", url);
    console.log("params:", params);
    console.log("user:", user);
    ctx.body = {
      success: true,
      data: user
    };
  }
  /**
   * 微信跳转处理
   */
  async redirect(ctx, next) {
    let target = config.SITE_ROOT_URL + "/oauth";
    let scope = "snsapi_userinfo";
    let { visit, id } = ctx.query;
    let params = `${visit}_${id}`;
    let url = getAuthorizeURL(scope, target, params);
    ctx.redirect(url);
  }

  /**
   * 测试接口
   * @param {} ctx 
   * @param {*} next 
   */
  async test(ctx, next) {
    let res = await this.handle("fetchUserList");
    ctx.body = {
      data: res
    };
  }
}

export default new weixinController();
