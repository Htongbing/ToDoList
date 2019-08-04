const Koa = require('koa')
const app = new Koa()
const routing = require('./routes')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/todolist', {
  useNewUrlParser: true,
  useFindAndModify: false
}, () => console.log('MongoDB connected'))
mongoose.connection.on('error', console.error)

app.use(error({
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))
app.use(bodyparser())
app.use(parameter(app))

routing(app)

app.listen(8080, () => console.log('Your application is running here: http://localhost:8080'))