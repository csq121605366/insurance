// nodemailer 发送邮件
import nodemailer from 'nodemailer';
import config from '../config'
import { eamiltpl } from './tpl';
class sendEmail {
  constructor() {
    this.email = config.email
    this.mailOptions = {
      from: '121605366@qq.com', // sender address
      to: 'shangqing.cai@mail.rayplus.net', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>' // html body
    }
  }


  send(param) {
    // sendEmail.send({ type: '用户注册', to: '121605366@qq.com', username: formData.username, title: '注册', time: 30, code: 66666 });
      if (!param || !param.to || !param.type || !param.title || !param.username || !param.time || !param.code) {
        return '发送邮件的参数不完整';
      }
      let html = eamiltpl(param);
      let mailOptions = {
        from: this.email.accountUser,
        to: param.to,
        subject: param.title,
        text: '',
        html: html
      }
      let s = nodemailer.createTransport({
        service: this.email.service,
        host: this.email.host,
        port: this.email.port,
        secure: this.email.secure, // true for 465, false for other ports
        auth: {
          user: this.email.accountUser, // generated ethereal user
          pass: this.email.accountPass // generated ethereal password
        }
      }).sendMail(mailOptions, (error, info) => {
        if (error) {
          return '邮件发送失败';
        }
        return;
      })
  }
}

export default new sendEmail();