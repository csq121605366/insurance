import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";
import validate from "../validate";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  openid: String, // 微信的id
  username: {
    type: String,
    trim: true,
    required: true
  }, //用户账号
  password: {
    type: String,
    required: true
  }, //密码
  role: {
    type: String,
    enum: config.USER_ROLE_TYPE, //设置角色
    default: config.USER_ROLE_TYPE[0]
  }, //角色
  nickname: String, //别名
  email: {
    type: String,
    validate: {
      validator: validate.email,
      message: "格式不正确"
    }
  }, // 邮箱
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 1
  }, //用户账号状态 0未激活 1激活 2锁定
  name: String, //姓名
  gender: {
    type: Number,
    enum: [0, 1, 2] //0代表女性 1代表男性 2代表未知
  }, //性别
  avatarUrl: String, //头像地址
  phoneNumber: {
    type: String,
    validate: {
      validator: validate.phone,
      message: "必须是有效的11位手机号码!"
    }
  }, //手机号
  idcard: {
    type: String,
    validate: {
      validator: validate.idcardnumber,
      message: "身份证不正确"
    }
  },
  address: String, //联系地址
  country: String, //国家
  province: String, //省份
  city: String, //城市
  description: String, //描述
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
UserSchema.virtual("isLocked").get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

UserSchema.pre("save", function(next) {
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

UserSchema.methods = {
  comparePassword: function(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, async (err, isMatch) => {
        if (!err && isMatch) {
          // 如果登录成功重置尝试登录次数为0;
          await this.update({
            $set: {
              loginAttempts: 1
            },
            $unset: {
              lockUntil: 1
            }
          });
          resolve();
        } else {
          reject();
        }
      });
    });
  },
  incLoginAttempts: async function() {
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
const User = mongoose.model("User", UserSchema);
export default User;
