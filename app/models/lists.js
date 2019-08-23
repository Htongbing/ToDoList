const mongoose = require('mongoose')
const { Schema, model } = mongoose

const listSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  remark: String,
  createdTime: {
    type: Date,
    default: Date.now()
  },
  estimatedTime: Date,
  finishedTime: Date,
  status: {
    type: Number,
    default: 0
  }
})

module.exports = model('List', listSchema)