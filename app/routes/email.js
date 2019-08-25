const Router = require('koa-router')
const router = new Router({
  prefix: '/email'
})
const { sendVerificationCode } = require('../controllers/email')
const author = require('../middlewares/author')()

router.post('/sendCode', author, sendVerificationCode)

module.exports = router