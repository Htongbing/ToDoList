const mongoose = require('mongoose')
const { Schema, model } = mongoose
const ObjectId = Schema.Types.ObjectId

const taskSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  userId: {
    type: ObjectId,
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
    get: val => + new Date(val)
  },
  estimatedTime: {
    type: Date,
    get: val => + new Date(val)
  },
  finishedTime: {
    type: Date,
    get: val => + new Date(val)
  },
  // 任务当前的状态，0：未完成；1：已完成，2：已延期
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  }
})
taskSchema.set('toJSON', { getters: true })

taskSchema.pre('save', function(next) {
  this.createdTime = Date.now()
  next()
})

module.exports = model('Task', taskSchema)