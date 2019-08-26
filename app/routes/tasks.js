const Router = require('koa-router')
const router = new Router({
  prefix: '/tasks'
})
const { getList, createTask, updateTask, deleteTask, finishTask, getStatistics } = require('../controllers/tasks')
const author = require('../middlewares/author')(true)

router.get('/', author, getList)
router.post('/', author, createTask)
router.put('/:id', author, updateTask)
router.delete('/:ids', author, deleteTask)
router.post('/finish', author, finishTask)
router.get('/statistics', author, getStatistics)

module.exports = router