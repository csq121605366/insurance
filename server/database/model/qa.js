

import mongoose from "mongoose";
import validate from "../validate";

const Schema = mongoose.Schema;

/**
 * 回复详情
 */
const QaDetailSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }//关联用户列表
    , content: String//回复内容
    , status: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 1
    }// 问题状态 0未完成 1已回复 2已删除
    , meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

QaDetailSchema.pre("save", function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
        this.meta.updatedAt = Date.now();
    }
    next();
});


export const QaDetail = mongoose.model("QaDetail", QaDetailSchema);

/**
 * 
 * 问题
 * 
 */
const QaSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }//关联用户列表
    , section: {
        type: Schema.Types.ObjectId,
        ref: 'Section'
    }// 关联科室
    , question_title: {
        type: Object,
        alias: 'qt'
    }//提问title
    , question_content: {
        type: String,
        alias: 'qc'
    }// 提问详细内容
    , answer_list: [QaDetailSchema] //嵌入子文档
    , status: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 1
    }// 问题状态 0未完成 1已提问 2已回复 3 已删除
    , meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})
QaSchema.pre("save", function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
        this.meta.updatedAt = Date.now();
    }
    next();
});
export const Qa = mongoose.model("Qa", QaSchema);
