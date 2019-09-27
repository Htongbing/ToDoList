const Router = require('koa-router')
const router = new Router({
  prefix: '/users'
})
const { signUp, signIn, resetPassword, noticeSetting, getNoticeSetting } = require('../controllers/users')
const normalAuthor = require('../middlewares/author')(true)
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
router.put('/resetPassword', author, resetPassword)
router.put('/noticeSetting', normalAuthor, noticeSetting)
router.get('/noticeSetting', normalAuthor, getNoticeSetting)

module.exports = router