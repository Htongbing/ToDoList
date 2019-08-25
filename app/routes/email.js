const Router = require('koa-router')
const router = new Router({
  prefix: '/email'
})
const { sendVerificationCode, verify, forgot } = require('../controllers/email')
const author = require('../middlewares/author')()

router.post('/sendCode', author, sendVerificationCode)
router.post('/verify', author, verify)
router.post('/forgot', forgot)

module.exports = router