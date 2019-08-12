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
    default: 0
  }
})

module.exports = model('User', userSchema)