/**
 * node定时器任务
 * second (0 - 59, OPTIONAL) minute (0 - 59)hour (0 - 23)day of month (1 - 31) month (1 - 12)day of week (0 - 7) (0 or 7 is Sun)
 */
import sd from "node-schedule";
import config from "../config";
import weixinProtoType from "../controllers/prototype/weixinProtoType.js";

export const schedule = () => {
  var wp = new weixinProtoType();
  var j = sd.scheduleJob(config.wechat.refreshTime, function() {
    // 定时执行获取access_token
    wp.fetchToken("access_token");
  });
};
