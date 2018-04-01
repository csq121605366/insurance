import request from "request-promise";
import fs from "fs";
import path from "path";
// 签名算法
import { sign } from "./common";

const baseUrl = "https://api.weixin.qq.com/cgi-bin/";
const api = {
  accessToken: baseUrl + "token?grant_type=client_credential",
  temporary: {
    upload: baseUrl + "media/upload?",
    fetch: baseUrl + "media/get?"
  },
  permanent: {
    // 新增其他类型素材
    upload: baseUrl + "material/add_material?",
    // 新增图文素材
    uploadNews: baseUrl + "material/add_news?",
    // 上传图文消息内的图片获取URL
    uploadNewsPic: baseUrl + "media/uploadimg?",
    // 获取素材
    fetch: baseUrl + "material/get_material?",
    // 删除永久素材
    del: baseUrl + "material/del_material?",
    // 修改永久图文素材
    update: baseUrl + "material/update_news?",
    // 获取素材总数
    count: baseUrl + "material/get_materialcount?",
    // 获取素材列表
    batch: baseUrl + "material/batchget_material?"
  },
  tags: {
    // 创建标签
    create: baseUrl + "tags/create?",
    // 获取公众号已创建的标签
    fetch: baseUrl + "tags/get?",
    // 编辑标签
    update: baseUrl + "tags/update?",
    // 删除标签
    del: baseUrl + "tags/delete?",
    // 获取标签下粉丝列表
    fetchUsers: baseUrl + "user/tag/get?",
    // 批量为用户打标签
    batchTag: baseUrl + "tags/members/batchtagging?",
    // 批量为用户取消标签
    batchUnTag: baseUrl + "tags/members/batchuntagging?",
    // 获取用户身上的标签列表
    getTagList: baseUrl + "tags/getidlist?"
  },
  user: {
    // 设置用户备注名
    remark: baseUrl + "user/info/updateremark?",
    // 获取用户基本信息（包括UnionID机制）
    info: baseUrl + "user/info?",
    // 批量获取用户基本信息
    batchInfo: baseUrl + "user/info/batchget?",
    // 获取用户列表
    fetchUserList: baseUrl + "user/get?",
    // 获取公众号的黑名单列表
    getBlackList: baseUrl + "tags/members/getblacklist?",
    // 批量拉黑用户
    batchBlackUsers: baseUrl + "tags/members/batchblacklist?",
    // 批量取消拉黑用户
    batchUnBlackUsers: baseUrl + "tags/members/batchunblacklist?"
  },
  menu: {
    // 自定义菜单创建接口
    create: baseUrl + "menu/create?",
    // 自定义菜单查询接口
    get: baseUrl + "menu/get?",
    // 自定义菜单删除接口
    del: baseUrl + "menu/delete?",
    // 创建个性化菜单
    addCondition: baseUrl + "menu/addconditional?",
    // 删除个性化菜单
    delCondition: baseUrl + "menu/delconditional?",
    // 测试个性化菜单匹配结果
    tryCatch: baseUrl + "menu/trymatch?",
    // 获取自定义菜单配置接口
    getCurrentMenuInfo: baseUrl + "get_current_selfmenu_info?"
  },
  ticket: {
    get: baseUrl + "ticket/getticket?"
  }
};

function statFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, (err, stat) => {
      if (err) reject(err);
      resolve(stat);
    });
  });
}

// 抛出Wechat
export default class Wechat {
  constructor(opts) {
    this.opts = Object.assign({}, opts);
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getTicket = opts.getTicket;
    this.saveTicket = opts.saveTicket;
    this.fetchAccessToken();
  }
  async request(options) {
    options = Object.assign({}, options, { json: true });
    try {
      const response = await request(options);
      return response;
    } catch (error) {
      console.error("request:", error);
    }
  }
  async fetchAccessToken() {
    // 获取token
    let data = await this.getAccessToken();
    // 测试token是否可用
    if (!this.isVaildToken(data, "access_token")) {
      // 如果不可用就更新token
      data = await this.updateAccessToken();
    }
    // 保存token
    await this.saveAccessToken(data);
    return data;
  }

  async updateAccessToken() {
    const url =
      api.accessToken + "&appid=" + this.appID + "&secret=" + this.appSecret;
    const data = await this.request({ url: url });
    const now = new Date().getTime();
    const expiresIn = now + (data.expires_in - 20) * 1000;
    data.expires_in = expiresIn;
    return data;
  }

  /**
   * 获取ticket票据
   */
  async fetchTicket(token) {
    let data = await this.getTicket();
    if (!this.isVaildToken(data, "ticket")) {
      data = await this.updateTicket(token);
    }
    await this.saveTicket(data);
    return data;
  }

  /**
   * 更新ticket
   * @param {*} token
   */
  async updateTicket(token) {
    let url = api.ticket.get + "&access_token=" + token + "&type=jsapi";
    let data = await this.request({ url: url });
    let now = new Date().getTime();
    let expiresIn = now + (data.expires_in - 20) * 1000;
    data.expires_in = expiresIn;
    return data;
  }

  /**
   *
   * @param {*} data 日期
   * @param {*} name
   */
  isVaildToken(data, name) {
    // 检测获取的token是否有效
    if (!data || !data[name] || !data.expires_in) {
      return false;
    }
    // 获取token生成时间
    const expiresIn = data.expires_in;
    // 获取当前时间
    const now = new Date().getTime();

    if (now < expiresIn) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 事件句柄
   * @param {*} operation 操作类型
   * @param {*} args 其余参数
   */
  async handle(operation, ...args) {
    let tokenData = await this.fetchAccessToken();
    let options = this[operation](tokenData.token, ...args);
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
    let url = permanent ? api.permanent.upload : api.temporary.upload;
    if (permanent) {
      form = Object.assign({}, form, permanent);
    }
    if (type === "pic") {
      url = api.permanent.uploadNewsPic;
    }
    if (type === "news") {
      url = api.permanent.uploadNews;
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
    let url = permanent ? api.permanent.upload : api.temporary.upload;
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
      api.permanent.del + "access_token=" + token + "&media_id=" + meidaId;
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
      api.permanent.update + "access_token=" + token + "&media_id=" + mediaId;
    return { method: "GET", url: url, body: form };
  }

  /**
   *  返回素材总数
   * @param {*} token token
   * @param {*} options 参数
   */
  countMaterial(token, options = { type: "image", offset: 0, count: 10 }) {
    let url = api.permanent.batch + "access_token=" + token;
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
    let url = api.tags.create + "access_token=" + token;
    return { method: "POST", url: url, body: form };
  }

  /**
   * 获取公众号已创建的标签
   * @param {*} token
   */
  fetchTags(token) {
    let url = api.tags.fetch + "access_token=" + token;
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
    let url = api.tag.update + "access_token=" + token;
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
    let url = api.tags.update + "access_token=" + token;
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
    let url = api.tags.fetchUsers + "access_token=" + token;
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
    let url = unTag ? api.tags.batchUnTag : api.tags.batchTag;
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
    let url = api.tags.getTagList + "access_token=" + token;
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
    let url = api.user.remark + "access_token=" + token;
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
      api.user.info + `access_token=${token}&openid=${openid}&lang=${lang}`;
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

    let url = api.user.batchInfo + `access_token=${token}`;
    return { method: "POST", url: url, body: form };
  }

  /**
   * 获取用户列表
   * @param {*} token
   * @param {*} next_openid
   */
  fetchUserList(token, next_openid) {
    let url =
      api.user.fetchUserList +
      `access_token=${token}&next_openid=${next_openid || ""}`;
    return { method: "GET", url: url };
  }

  /**
   * 自定义菜单创建接口
   * @param {*} token
   * @param {*} menu
   */
  createMenu(token, menu) {
    let url = api.menu.create + "access_token=" + token;
    return { method: "POST", url: url, body: menu };
  }

  /**
   * 自定义菜单查询接口
   * @param {*} token
   */
  getMenu(token) {
    let url = api.menu.get + "access_token=" + token;
    return { method: "GET", url: url };
  }

  /**
   * 自定义菜单删除接口
   * @param {*} token
   */
  delMenu(token) {
    let url = api.menu.get + "access_token=" + token;
    return { method: "GET", url: url };
  }

  /**
   * 创建个性化菜单
   * @param {*} token
   * @param {*} button 一级菜单数组，个数应为1~3个
   * @param {*} matchrule 菜单匹配规则
   */
  addConditionMenu(token, button, matchrule) {
    let url = api.menu.addCondition + "accss_token=" + token;
    return { method: "POST", url: url, body: { button, matchrule } };
  }

  /**
   * 删除个性化菜单
   * @param {*} token
   * @param {*} menuid menuid为菜单id，可以通过自定义菜单查询接口获取。
   */
  delConditionMenu(token, menuid) {
    let url = api.menu.addCondition + "accss_token=" + token;
    return { method: "POST", url: url, body: { menuid } };
  }

  /**
   * 测试个性化菜单匹配结果
   * @param {*} token
   * @param {*} user_id user_id可以是粉丝的OpenID，也可以是粉丝的微信号。
   */
  tryCatchMenu(token, user_id) {
    let url = api.menu.tryCatch + "accss_token=" + token;
    return { method: "POST", url: url, body: { user_id } };
  }

  /**
   * 获取自定义菜单配置接口
   * @param {*} token
   */
  getCurrentMenuInfo(token) {
    let url = api.menu.getCurrentMenuInfo + "accss_token=" + token;
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
