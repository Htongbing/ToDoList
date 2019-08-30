const Task = require('../models/tasks')
const { CronJob } = require('cron')

const timingTask = async () => {
  try {
    await Task.updateMany({ status: 0, estimatedTime: { $lt: Date.now() } }, { status: 2 })
  } catch (e) {
    console.log(e)
  }
}

const job = new CronJob('0 * * * * *', timingTask)

module.exports = job