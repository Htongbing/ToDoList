const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
  account: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // 邮箱验证状态，0：未验证，1：已验证
  emailStatus: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  needNotice: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  noticeTime: String,
  nextNoticeTime: Date
})

module.exports = model('User', userSchema)