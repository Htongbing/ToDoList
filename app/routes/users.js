const Router = require('koa-router')
const router = new Router({
  prefix: '/users'
})
const { signUp } = require('../controllers/users')

router.post('/signUp', signUp)

module.exports = router