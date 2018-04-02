import xml2js from "xml2js";
import { wxtpl } from "./tpl";
import sha1 from "sha1";

export function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true }, (err, content) => {
      if (err) reject(err);
      else resolve(content);
    });
  });
}

export function formatMessage(res) {
  let message = {};
  if (typeof res === "object") {
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      let item = res[keys[i]];
      let key = keys[i];
      if (!(item instanceof Array) || item.length === 0) {
        continue;
      }
      if (item.length === 1) {
        let val = item[0];
        if (typeof val === "object") {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || "").trim();
        }
      } else {
        message[key] = [];
        for (let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]));
        }
      }
    }
  }
  return message;
}

export function template(content, message) {
  // content回复内容，message解析后的消息
  let info = {};
  let type = "text";
  content = content || "Empty News";
  if (content && content.type) {
    type = content.type;
  }
  if (Array.isArray(content)) {
    type = "news";
  }
  info = Object.assign(
    {},
    {
      content: content,
      createTime: new Date().getTime(),
      msgType: type,
      toUserName: message.FromUserName,
      fromUserName: message.ToUserName
    }
  );
  return wxtpl(info);
}

/**
 * 创建随机字符串
 */
export function createNonce() {
  return Math.random()
    .toString(36)
    .substr(2, 15);
}

/**
 * 生成邮箱code码
 * @param {*} len 
 */
export function createCode(len) {
  let code = "";
  var codeLength = len || 6;//验证码的长度   
  var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//随机数   
  for (var i = 0; i < codeLength; i++) {//循环操作   
    var index = Math.floor(Math.random() * 36);//取得随机数的索引（0~35）   
    code += random[index];//根据索引取得随机数加到code上   
  }
  return code;
}

/**
 * 时间转换
 * @param {*} msd 
 */
export function timefomate(msd) {  
  var time = parseFloat(msd) / 1000;  
  if (null != time && "" != time) {  
      if (time > 60 && time < 60 * 60) {  
          time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -  
              parseInt(time / 60.0)) * 60) + "秒";  
      }  
      else if (time >= 60 * 60 && time < 60 * 60 * 24) {  
          time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -  
              parseInt(time / 3600.0)) * 60) + "分钟" +  
              parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -  
              parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";  
      }  
      else {  
          time = parseInt(time) + "秒";  
      }  
  }  
  return time;  
}

/**
 * 创建时间戳
 */
export function createTimesstamp() {
  return parseInt(new Date().getTime() / 1000) + "";
}

/**
 * 签名格式化
 * @param {*} args 参数
 */
export function raw(args) {
  let keys = Object.keys(args);
  keys = keys.sort();
  let newArgs = {};
  keys.forEach(key => {
    newArgs[key.toLowerCase()] = args[key];
  });
  let str = "";
  for (let k in newArgs) {
    str += "&" + k + "=" + newArgs[k];
  }
  return str.substr(1);
}

/**
 * 加密
 * @param {*} nonce 随机字符串
 * @param {*} ticket 签名
 * @param {*} timestamp 时间戳
 * @param {*} url 地址
 */
export function signIt(noncestr, ticket, timestamp, url) {
  let ret = {
    jsapi_ticket: ticket,
    noncestr,
    timestamp,
    url
  };
  let str = raw(ret);
  console.log(str);
  let sha = sha1(str);
  return sha;
}

/**
 * 签名
 * @param {*} ticket
 * @param {*} url
 */
export function sign(ticket, url) {
  let noncestr = createNonce();
  let timestamp = createTimesstamp();
  let signature = signIt(noncestr, ticket, timestamp, url);
  return {
    noncestr,
    timestamp,
    signature
  };
}
