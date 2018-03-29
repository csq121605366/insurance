import User from "./prototype/User";

export default class Admin extends User {
  constructor(ctx, next) {
    super();
    this.ctx = ctx;
    this.next = next;
  }

  /**
   * 登录业务操作
   * @param  {object} formData 登录表单信息
   * @return {object}          登录业务操作结果
   */
  async signIn(formData) {
    if (!formData.username) {
      this.next();
    }
    let user = await super.User.findOne({ username: formData.username });
    super.User.comparePassword(password);
  }
}
