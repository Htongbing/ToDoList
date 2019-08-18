const Router = require('koa-router')
const router = new Router({
  prefix: '/users'
})
const { signUp, signIn } = require('../controllers/users')

router.post('/signUp', signUp)
router.post('/signIn', signIn)

module.exports = router