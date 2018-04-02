/**
 * 
 * 管理员信息
 * 
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";
import validate from "../validate";
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: String,
    trim: true
  }, //用户账号
  password: {
    type: String
  }, //密码
  email: {
    type: String,
    validate: {
      validator: validate.email,
      message: "格式不正确"
    }
  }, // 邮箱
  role: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  },//管理员类型 1普通管理员 2.可读可写管理员 3.root管理员
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 1
  }, //用户账号状态 0未激活 1激活 2锁定 3已删除
  email_code: {
    code: String,
    createdAt: Date
  }, //{code:验证码,createdAt:发送时间}
  avatarUrl: String, //头像地址
  phoneNumber: {
    type: String,
    validate: {
      validator: validate.phone,
      message: "必须是有效的11位手机号码!"
    }
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  }, // 登录错误试图次数
  lockUntil: {
    type: Number
  }, //锁定账号的截至时间
  resetPasswordToken: String, //重置密码token
  resetPasswordTime: Date, //重置密码时间
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

// 定义虚拟属性是否锁了
AdminSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

AdminSchema.pre("save", function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

AdminSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(config.SALT_STRENGTH, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);
      user.password = hash;
      next();
    });
  });
});

AdminSchema.methods = {
  comparePassword: function (password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, async (err, isMatch) => {
        if (err) reject('err');
        if (isMatch) {
          // 如果登录成功重置尝试登录次数为0;
          await this.update({
            $set: {
              loginAttempts: 1
            },
            $unset: {
              lockUntil: 1
            }
          }, function (err, doc) {
            if (!err) resolve(isMatch)
            reject(err);
          })
          console.log(isMatch)
        } else {
          resolve(isMatch)
        }
      });
    });
  },
  incLoginAttempts: async function () {
    if (this.lockUntil && this.lockUntil < Date.now()) {
      // 解锁
      return await this.update({
        $set: {
          loginAttempts: 1
        },
        $unset: {
          lockUntil: 1
        }
      });
    }
    // 不符合解锁就每次登录增加次数
    var updates = {
      $inc: {
        loginAttempts: 1
      }
    };
    if (this.loginAttempts + 1 >= config.MAX_LOGIN_ATTEMPTS && !this.isLocked) {
      updates.$set = {
        lockUntil: Date.now() + config.LOCK_TIME
      };
    }
    return await this.update(updates);
  }
};
const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;

