const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
  ctx.body = '<h1>Home</h1>'
})
app.listen(8080)