require('dotenv').config()
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const Koa = require('koa')
const app = new Koa()
const routing = require('./routes')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('./middlewares/parameter')
const mongoose = require('mongoose')
const success = require('./middlewares/success')
const { mongoUrl, mongoTable, redisUrl, redisPort } = require('./const/config')
mongoose.connect(`mongodb://${mongoUrl}/${mongoTable}`, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
})
mongoose.connection.on('error', console.error).on('connected', () => console.log('MongoDB connected'))
const Redis = require('ioredis')
const redis = new Redis(redisPort, redisUrl)
app.context.redis = redis
const job = require('./timingTask')
job.start()

app.use(error({
  postFormat: (error, { stack }) => {
    const { status, message, statusCode } = error
    const res = {
      code: status || statusCode || 500,
      message
    }
    error.status = /^(?!404)4/.test(res.code) ? 200 : res.code
    fs.appendFileSync(path.join(__dirname, '../error.log'), `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${stack}\n\n`)
    return process.env.NODE_ENV === 'production' ? res : { stack, ...res }
  }
}))
app.use(bodyparser())
app.use(parameter(app))
app.use(success(app))

routing(app)

app.listen(8080, () => console.log('Your application is running here: http://localhost:8080'))