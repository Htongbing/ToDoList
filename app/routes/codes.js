const Router = require('koa-router')
const router = new Router({
  prefix: '/codes'
})
const { getCode } = require('../controllers/codes')

router.get('/', getCode)

module.exports = router