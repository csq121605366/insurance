export default {
  USER_ROLE_TYPE: ["user", "doctor", "agent"], //用户角色列表 默认选择第一个角色
  SALT_STRENGTH: 10,
  MAX_LOGIN_ATTEMPTS: 15,
  // LOCK_TIME: 2 * 60 * 60 * 1000
  LOCK_TIME: 10 * 1000
};
