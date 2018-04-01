// 回复策略
let tip = `hellow weixin`;

// import { getWechat } from "../controllers/wechat";
import menu from "./menu";

export default async (ctx, next) => {
  const message = ctx.weixin;
  if (message.MsgType === "event") {
    if (message.Event === "subscribe") {
      ctx.body = tip;
    } else if (message.Event === "unsubscribe") {
      console.log(message.FromUserName + "取关了");
    } else if (message.Event === "LOCATION") {
      ctx.body = "经度:" + message.Latitude + ";维度:" + message.Longitude;
    } else if (message.Event === "view") {
      ctx.body = message.EventKey + message.MenuId;
    } else if (message.Event === "pic_sysphoto") {
      ctx.body = message.Count + "photos sent";
    }
  } else if (message.MsgType === "text") {
    // let data = "";
    // if (message.Content === "1") {
    //   data = message.Content
    // } else if (message.Content === "2") {
    //   data = await getWechat.handle("createMenu", menu);
    // } else if (message.Content === "3") {
    //   data = await getWechat.handle("delMenu");
    // } else if (message.Content === "4") {
    //   data = await getWechat.handle(
    //     "batchTag",
    //     ["oL4Apwv4Oz42DKG3Ngr0bstgRavQ"],
    //     100,
    //     true
    //   );
    // } else if (message.Content === "5") {
    //   data = await getWechat.handle(
    //     "getTagList",
    //     "oL4Apwv4Oz42DKG3Ngr0bstgRavQ"
    //   );
    // }
    console.log(message);
    ctx.body = message.Content;
  } else if (message.MsgType === "image") {
    ctx.body = {
      type: message.MsgType,
      mediaId: message.MediaId
    };
  } else if (message.MsgType === "voice") {
    ctx.body = {
      type: message.MsgType,
      mediaId: message.MediaId
    };
  } else if (message.MsgType === ("video" || "shortvideo")) {
    ctx.body = {
      title: message.ThumbMediaId,
      type: message.MsgType,
      mediaId: message.MediaId,
      description: message.ThumbMediaId
    };
  } else if (message.MsgType === "location") {
    ctx.body =
      message.Location_X + ":" + message.Location_Y + ":" + message.Label;
  } else if (message.MsgType === "link") {
    ctx.body = {
      title: message.Title,
      description: message.Description,
      picUrl: "",
      url: message.Url
    };
  }
};
