const Router = require('koa-router')
const router = new Router({
  prefix: '/tasks'
})
const { getList, createTask } = require('../controllers/tasks')
const author = require('../middlewares/author')(true)

router.get('/', author, getList)
router.post('/', author, createTask)

module.exports = router