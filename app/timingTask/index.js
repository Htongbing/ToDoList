const { updateStatus } = require('../controllers/tasks')
const { timingEmail } = require('../controllers/email')
const { CronJob } = require('cron')

const timingTask = () => {
  Promise.all([updateStatus(), timingEmail()])
}

const job = new CronJob('0 * * * * *', timingTask)

module.exports = job