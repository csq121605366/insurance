import AdminModel from "../database/model/admin";
import jwt from "jsonwebtoken";
import config from "../config";
import R from "ramda";
import sendEmail from '../util/sendEmail';
import { createCode, timefomate } from '../util/common'

class UserController {
  constructor() { }

  /**
   * 管理员登录业务操作
   */
  async login(ctx, next) {
    let find,
      match,
      canLogin,
      formData = ctx.request.body;
    find = await AdminModel.findOne({ username: formData.username }).exec();
    if (find.status == 0) ctx.throw(403, '该账户还未激活!');
    if (find.status == 2) ctx.throw(403, '该账户已被锁定!');
    if (find.status == 3) ctx.throw(403, '该账户已被删除!');
    if (find) {
      // 如果没有被锁
      find.incLoginAttempts();
      if (!find.isLocked) {
        await find.comparePassword(formData.password, find.password).then(ismatch => {
          if (ismatch) {
            ctx.body = {
              username: find.username,
              email: find.email,
              role: find.role,
              avatarUrl: find.avatarUrl,
              phoneNumber: find.phoneNumber
            }
          } else {
            ctx.throw(406, '帐号密码有误')
          }
        }, err => {
          ctx.throw(500, '操作错误')
        })
        // let info = await sendEmail.send({ ty1pe: '用户注册', to: '121605366@qq.com', username: 'caishangqing', title: '注册', time: 30, code: 66666 });
        // ctx.session.user = {
        //   _id: find._id,
        //   username: find.username,
        //   email: find.email,
        //   avatarUrl: find.avatarUrl,
        //   phoneNumber: find.phoneNumber
        // }
        // ctx.body = {
        //   body: ctx.session.user
        // }
      } else {
        ctx.throw(404, "尝试登录次数太多,账号已被锁");
      }
    } else {
      ctx.throw(404, "账号未找到");
    }
  }

  /**
   * 注册
   * @param {} ctx 
   * @param {*} next 
   */
  async register(ctx, next) {
    let find, one, formData = ctx.body;
    find = await AdminModel.findOne({ username: formData.username }).exec();
    if (!find) {
      one = new AdminModel({
        username: formData.username,
        password: formData, password
      })
      one.save(function (err, doc) {
        if (err) ctx.throw(500, '创建失败');
        console.log(doc);
        ctx.body = {
          data: {
            message: '创建成功',
            username: formData.username
          }
        }
      })
    } else {
      ctx.throw(406, '该用户已存在!')
    }
  }

  /**
   * 邮箱注册发送邮件
   * @param {*} ctx 
   * @param {*} next 
   */
  // async sendEmail(ctx, next) {
  //   let find, newAdmin,
  //     formData = ctx.request.body;
  //   find = await AdminModel.findOne({ email: formData.email }).exec();
  //   // 邮箱已注册和被锁定 就不允许发送邮件
  //   if (find && find.status === 1) ctx.throw(406, '该邮箱已注册!');
  //   if (find && find.status === 2) ctx.throw(406, '该邮箱所注册帐号已被锁定!');
  //   // 邮箱未激活 可以发送 但是要查看邮箱发送时间
  //   if (find && find.status === 0) {
  //     // 邮件发送间隔内
  //     if (find.email_code && find.email_code.createdAt + config.email.interval > Date.now()) {
  //       ctx.throw(400, `邮件发送间隔为${timefomate(config.email.interval)}`)
  //     }
  //   } else {
  //     newAdmin = new AdminModel({
  //       username: formData.email,
  //       email: formData.email,
  //       email_code: {
  //         code: createCode(),
  //         createdAt: Date.now()
  //       }
  //     })
  //   }
  //   await newAdmin.save(function (err, doc) {
  //     if (err) ctx.throw(400, err.)
  //   })
  //   // await 
  // }

  async logout() {

  }

  // async getUserInfo(ctx, next) {
  //   let find,
  //     formData = ctx.request.body,
  //     token = ctx.state.user;
  //   find = await AdminModel.findOne({ username: formData.username })
  //     .select("-password -loginAttempts -lockUntil -meta")
  //     .exec();
  //   console.log(find);
  //   ctx.body = { data: find };
  // }

  // async register(ctx, next) {
  //   let find,
  //     formData = ctx.request.body;
  //   find = await AdminModel.findOne({ username: formData.username }).exec();
  //   if (!find) {
  //     await new AdminModel(formData)
  //       .save()
  //       .then(res => {
  //         ctx.body = {
  //           message: "创建成功",
  //           username: res.username
  //         };
  //       })
  //       .catch(err => {
  //         ctx.throw(406, R.keys(err.errors).join(" ") + " 格式错误");
  //       });
  //   } else {
  //     ctx.throw(406, "用户名已存在");
  //   }
  // }
}

export default new UserController();
