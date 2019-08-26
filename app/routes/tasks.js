const Router = require('koa-router')
const router = new Router({
  prefix: '/tasks'
})
const { getList, createTask, updateTask, deleteTask } = require('../controllers/tasks')
const author = require('../middlewares/author')(true)

router.get('/', author, getList)
router.post('/', author, createTask)
router.put('/:id', author, updateTask)
router.delete('/:ids', author, deleteTask)

module.exports = router