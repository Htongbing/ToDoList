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
  }
})

module.exports = model('User', userSchema)