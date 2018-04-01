import mongoose from "mongoose";

const WeixinSchema = new mongoose.Schema({
  name: String,
  data: String,
  expires_in: Number,
  meta: {
    created: {
      type: Date,
      default: Date.now()
    },
    updated: {
      type: Date,
      default: Date.now()
    }
  }
});

WeixinSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.created = this.meta.updated = Date.now();
  } else {
    this.meta.updated = Date.now();
  }
  next();
});

let Weixin = mongoose.model("Weixin", WeixinSchema);
export default Weixin;
