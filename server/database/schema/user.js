import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: Number,
    index: true,
    unique: true
  },
  openid: String, // 微信的id
  username: {
    type: String,
    trim: true
  }, //用户账号
  password: String, //密码
  hashed_password: String, //hashed密码
  role: {
    type: String,
    enum: config.USER_ROLE_TYPE, //设置角色
    default: config.USER_ROLE_TYPE[0]
  }, //角色
  email: String, // 邮箱
  name: String, //姓名
  gender: String, //性别
  avatarUrl: String, //头像地址
  nickname: String, //别名
  phoneNumber: String, //手机号
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

// 定义token
UserSchema.virtual("token").get(function() {
  var salt = bcrypt.genSaltSync(10);
  var token = bcrypt.hashSync(String(this._id), salt);
  return token;
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
  comparePassword: function(_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, function(err, isMatch) {
        if (!err) resolve(isMatch);
        else reject(err);
      });
    });
  },

  incLoginAttempts: function(user) {
    var that = this;
    return new Promise((resolve, reject) => {
      if (that.lockUntil && that.lockUntil < Date.now()) {
        that.update(
          {
            $set: {
              loginAttempts: 1
            },
            $unset: {
              lockUntil: 1
            }
          },
          function(err) {
            if (!err) resolve(true);
            else reject(err);
          }
        );
      }
      var updates = {
        $inc: {
          loginAttempts: 1
        }
      };
      if (
        that.loginAttempts + 1 >= config.MAX_LOGIN_ATTEMPTS &&
        !that.isLocked
      ) {
        updates.$set = {
          lockUntil: Date.now() + config.LOCK_TIME
        };
      }

      that.update(updates, err => {
        if (!err) resolve(true);
        else reject(err);
      });
    });
  }
};

mongoose.model("User", UserSchema);
