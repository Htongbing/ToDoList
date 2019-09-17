const jwt = require('koa-jwt')
const { secret } = require('../const/config')
const User = require('../models/users')

module.exports = function(emailAuthor = false) {
  return async (ctx, next) => {
    try {
      await jwt({ secret })(ctx, () => {})
    } catch (e) {
      ctx.throw(403, 'token已过期')
    }
    const { user: {id, emailStatus} } = ctx.state
    if (id !== ctx.request.query.userId) ctx.throw(403, '无权访问')
    if (emailAuthor && emailStatus !== 1) ctx.throw(403, '邮箱未验证')
    await next()
  }
}