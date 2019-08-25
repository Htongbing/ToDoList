const Router = require('koa-router')
const router = new Router({
  prefix: '/users'
})
const { signUp, signIn, resetPassword } = require('../controllers/users')
const jwt = require('koa-jwt')
const { secret } = require('../const/config')
const author = async (ctx, next) => {
  try {
    await jwt({ secret })(ctx, () => {})
    const { account } = ctx.state.user
    const EX = await ctx.redis.get(`EMAILLINKEX:${account}`)
    if (!EX) throw new Error()
  } catch (e) {
    ctx.throw(403, 'token已过期')
  }
  await next()
}

router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.post('/resetPassword', author, resetPassword)

module.exports = router