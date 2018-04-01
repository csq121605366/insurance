import WeixinModel from "../../database/model/weixin";
import config from "../../config";
import request from "request-promise";
import fs from "fs";
import path from "path";
// 签名算法
import { sign } from "../../util/common";
// 引入api地址
import api from "../../api/weixin";

export default class weixinProtoType {
  constructor() {
    this.WeixinModel = WeixinModel;
    this.appID = config.wechat.appID;
    this.appSecret = config.wechat.appSecret;
    this.token = config.wechat.token;
    this.api = api;
  }
  /**
   * 向微信请求接口
   */
  async request(options) {
    options = Object.assign({}, options, { json: true });
    try {
      const response = await request(options);
      return response;
    } catch (error) {
      throw new Error("向微信发送请求失败!");
    }
  }
  /**
   * 获取token
   */
  async fetchToken(name = "access_token") {
    if (!name) throw new Error("fetchToken 缺少参数");
    // 获取token
    let data = await this.getToken(name);
    // 测试token是否可用
    if (!this.isVaild(data)) {
      console.log("更新token");
      // 如果不可用就更新token
      data = await this.updateToken(name);
    }
    await this.saveToken(data, name);
    console.count("返回token");
    return data;
  }
  /**
   * 更新Token
   */
  async updateToken(name) {
    let url;
    if (name == "access_token") {
      url =
        this.api.accessToken +
        "&appid=" +
        this.appID +
        "&secret=" +
        this.appSecret;
    } else if (name == "ticket") {
      let find = await this.getToken('access_token');
      url = this.api.ticket.get + "&access_token=" + find.data + "&type=jsapi";
    }
    const data = await this.request({ url });
    data.expires_in = Date.now() + (data.expires_in - 20) * 1000;
    return data;
  }

  /**
   * 微信的access_token 和ticket的获取
   * @param {Object} data
   */
  async getToken(name) {
    if (!name) throw new Error("缺少参数");
    return await this.WeixinModel.findOne({
      name: name
    }).exec();
  }
  /**
   *  微信发过来的access_token 和ticket的保存
   * @param {Object} data
   */
  async saveToken(data, name) {
    let find;
    await this.WeixinModel.findOne({ name: name })
      .exec()
      .then(doc => {
        find = doc;
      })
      .catch(error => {
        throw new Error(error);
      });
    if (find) {
      find.data = data[name] ? data[name] : data.data;
      find.expires_in = data.expires_in;
    } else {
      find = new WeixinModel({
        name: name,
        data: data[name],
        expires_in: data.expires_in
      });
    }
    await find
      .save()
      .then(doc => {
        return doc;
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  /**
   * @param {*} data 日期
   * @param {*} name
   */
  isVaild(data) {
    // 检测获取的值是否有效 缺值就去更新
    if (!data || !data.data || !data.name || !data.expires_in) return false;
    // 时间比较
    return Date.now() < data.expires_in;
  }

  /**
   * 事件句柄
   * @param {*} operation 操作类型 (下列所有方法名字)
   * @param {*} args 其余参数
   */
  async handle(operation, ...args) {
    let tokenData = await this.fetchToken();
    let options = this[operation](tokenData.data, ...args);
    let data = await this.request(options);
    return data;
  }

  /**
   * 上传素材
   * @param {*} token token
   * @param {*} type 素材类型
   * @param {*} material 素材地址
   * @param {*} permanent 是否为永久素材，如果存在permanent则为永久素材否则相反
   */
  uploadMaterial(token, type, material, permanent) {
    let form = {};
    let url = permanent ? this.api.permanent.upload : this.api.temporary.upload;
    if (permanent) {
      form = Object.assign({}, form, permanent);
    }
    if (type === "pic") {
      url = this.api.permanent.uploadNewsPic;
    }
    if (type === "news") {
      url = this.api.permanent.uploadNews;
      form = material;
    } else {
      form.media = fs.createReadStream(material);
    }
    url = url + "access_token=" + token;
    if (!permanent) {
      url += "&type=" + type;
    } else {
      if (type !== "news") {
        form.access_token = token;
      }
    }
    if (type === "news") {
      return { method: "POST", url: url, body: form, json: true };
    } else {
      return { method: "POST", url: url, formData: form, json: true };
    }
  }

  /**
   * 获取素材
   * @param {*} token token
   * @param {*} mediaId 媒体id
   * @param {*} type 获取素材类型
   * @param {*} permanent 是否为永久素材，如果存在permanent则为永久素材否则相反
   */
  fetchMaterial(token, mediaId, type, permanent) {
    let form = {};
    let url = permanent ? this.api.permanent.upload : this.api.temporary.upload;
    let fetchUrl = url + "access_token=" + token;
    if (permanent) {
      form.media_id = mediaId;
      form.access_token = token;
    } else {
      if (type === "video") {
        url = url.replace("https://", "http://");
      }
      url += "&media_id=" + mediaId;
    }
    return { method: "POST", url: url, body: form };
  }

  /**
   *  删除永久素材
   * @param {*} token token
   * @param {*} meidaId 媒体id
   */
  deleteMaterial(token, meidaId) {
    let form = {
      media_id: mediaId
    };
    let url =
      this.api.permanent.del + "access_token=" + token + "&media_id=" + meidaId;
    return { method: "POST", url: url, body: form };
  }

  /**
   * 更新图文内容
   * @param {*} token token
   * @param {*} mediaId 媒体id
   * @param {*} news 新闻内容
   */
  updateMaterial(token, mediaId, news) {
    let form = {
      media_id: mediaId
    };
    from = Object.assign({}, form, news);
    let url =
      this.api.permanent.update +
      "access_token=" +
      token +
      "&media_id=" +
      mediaId;
    return { method: "GET", url: url, body: form };
  }

  /**
   *  返回素材总数
   * @param {*} token token
   * @param {*} options 参数
   */
  countMaterial(token, options = { type: "image", offset: 0, count: 10 }) {
    let url = this.api.permanent.batch + "access_token=" + token;
    return { method: "POST", url: url, body: options };
  }

  /**
   * 新增标签
   * @param {*} token
   * @param {*} name 要新增的标签名称
   */
  createTag(token, name) {
    let form = {
      tag: {
        name: name
      }
    };
    let url = this.api.tags.create + "access_token=" + token;
    return { method: "POST", url: url, body: form };
  }

  /**
   * 获取公众号已创建的标签
   * @param {*} token
   */
  fetchTags(token) {
    let url = this.api.tags.fetch + "access_token=" + token;
    return { url: url };
  }

  /**
   * 编辑标签
   * @param {*} token
   * @param {*} tagId
   * @param {*} name
   */
  updateTag(token, tagId, name) {
    let form = {
      tag: {
        id: tagId,
        name: name
      }
    };
    let url = this.api.tag.update + "access_token=" + token;
    return { methods: "POST", url: url, body: form };
  }

  /**
   * 删除标签
   * 当某个标签下的粉丝超过10w时，后台不可直接删除标签，
   * @param {*} token
   * @param {*} tagId
   */
  delTag(token, tagId) {
    let form = {
      tag: {
        id: tagId
      }
    };
    let url = this.api.tags.update + "access_token=" + token;
    return { methods: "POST", url: url, body: form };
  }

  /**
   * 获取标签下粉丝列表
   * @param {*} token
   * @param {*} tagId 标签id
   * @param {*} next_openid 第一个拉取的openid，不填写默认从头开始
   */
  fetchTagUsers(token, tagId, next_openid = "") {
    let form = {
      tagid: tagId,
      next_openid: next_openid
    };
    let url = this.api.tags.fetchUsers + "access_token=" + token;
    return { methods: "POST", url: url, body: form };
  }

  /**
   * 批量为用户打标签和删除标签
   * @param {*} token
   * @param {*} openIdList 粉丝列表
   * @param {*} tagId tag的标识符
   * @param {*} unTag true代表删除 不填或者false代表增加
   */
  batchTag(token, openidlist, tagid, unTag) {
    if (!Array.isArray(openidlist)) {
      throw new Error("传入的参数有误");
    }
    let form = {
      openid_list: openidlist,
      tagid: tagid
    };
    let url = unTag ? this.api.tags.batchUnTag : this.api.tags.batchTag;
    url += "access_token=" + token;
    return { method: "POST", url: url, body: form };
  }

  /**
   * 获取用户身上的标签列表
   * @param {*} token
   * @param {*} openid 用户id
   */
  getTagList(token, openid) {
    let form = {
      openid: openid
    };
    let url = this.api.tags.getTagList + "access_token=" + token;
    return { method: "POST", url: url, body: form };
  }

  /**
   * 设置用户备注名
   * @param {*} token
   * @param {*} openid 用户标识
   * @param {*} remark 备注名
   */
  remarkUser(token, openid, remark) {
    let form = {
      openid: openid,
      remark: remark
    };
    let url = this.api.user.remark + "access_token=" + token;
    return { method: "POST", url: url, body: form };
  }

  /**
   * 获取用户基本信息（包括UnionID机制）
   * @param {*} token
   * @param {*} openid
   * @param {*} lang 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
   */
  getUserInfo(token, openid, lang = "zh_CN") {
    let langList = ["zh_CN", "zh_TW", "en"];
    if (!lang.indexOf(langList) < 0) {
      throw new Error("传入的参数有误");
    }
    let url =
      this.api.user.info +
      `access_token=${token}&openid=${openid}&lang=${lang}`;
    return { method: "GET", url: url };
  }

  /**
   * 批量获取用户基本信息
   * @param {*} token
   * @param {*} openid
   */
  batchUserInfo(token, openidlist, lang = "zh_CN") {
    let langList = ["zh_CN", "zh_TW", "en"];
    if (!Array.isArray(openidlist) || !lang.indexOf(langList) < 0) {
      throw new Error("传入的参数有误");
    }
    let form = {
      user_list: []
    };
    openidlist.forEach(function(element, index) {
      form.user_list.push({
        openid: element,
        lang: lang
      });
    }, this);

    let url = this.api.user.batchInfo + `access_token=${token}`;
    return { method: "POST", url: url, body: form };
  }

  /**
   * 获取用户列表
   * @param {*} token
   * @param {*} next_openid (不填写 默认从头开始拉去)
   */
  fetchUserList(token, next_openid) {
    let url =
      this.api.user.fetchUserList +
      `access_token=${token}&next_openid=${next_openid || ""}`;
    return { method: "GET", url: url };
  }

  /**
   * 自定义菜单创建接口
   * @param {*} token
   * @param {*} menu
   */
  createMenu(token, menu) {
    let url = this.api.menu.create + "access_token=" + token;
    return { method: "POST", url: url, body: menu };
  }

  /**
   * 自定义菜单查询接口
   * @param {*} token
   */
  getMenu(token) {
    let url = this.api.menu.get + "access_token=" + token;
    return { method: "GET", url: url };
  }

  /**
   * 自定义菜单删除接口
   * @param {*} token
   */
  delMenu(token) {
    let url = this.api.menu.get + "access_token=" + token;
    return { method: "GET", url: url };
  }

  /**
   * 创建个性化菜单
   * @param {*} token
   * @param {*} button 一级菜单数组，个数应为1~3个
   * @param {*} matchrule 菜单匹配规则
   */
  addConditionMenu(token, button, matchrule) {
    let url = this.api.menu.addCondition + "accss_token=" + token;
    return { method: "POST", url: url, body: { button, matchrule } };
  }

  /**
   * 删除个性化菜单
   * @param {*} token
   * @param {*} menuid menuid为菜单id，可以通过自定义菜单查询接口获取。
   */
  delConditionMenu(token, menuid) {
    let url = this.api.menu.addCondition + "accss_token=" + token;
    return { method: "POST", url: url, body: { menuid } };
  }

  /**
   * 测试个性化菜单匹配结果
   * @param {*} token
   * @param {*} user_id user_id可以是粉丝的OpenID，也可以是粉丝的微信号。
   */
  tryCatchMenu(token, user_id) {
    let url = this.api.menu.tryCatch + "accss_token=" + token;
    return { method: "POST", url: url, body: { user_id } };
  }

  /**
   * 获取自定义菜单配置接口
   * @param {*} token
   */
  getCurrentMenuInfo(token) {
    let url = this.api.menu.getCurrentMenuInfo + "accss_token=" + token;
    return { method: "GET", url: url };
  }

  /**
   * 签名算法
   * @param {*} ticket 票据
   * @param {*} url 地址
   */
  sign(ticket, url) {
    return sign(ticket, url);
  }
}
