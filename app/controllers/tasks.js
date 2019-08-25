const Task = require('../models/tasks')
const { TASK_NAME_RE, TASK_CONTENT_RE } = require('../const')

class TaskCtl {
  async getList(ctx) {
    let { userId, page, pageSize } = ctx.request.query
    page = page < 1 ? 1 : Math.floor(Number(page)) || 1
    pageSize = pageSize < 1 ? 10 : Math.floor(Number(pageSize)) || 10
    const count = await Task.find({ userId }).countDocuments()
    const data = await Task.find({ userId }).skip((page - 1) * pageSize).limit(pageSize).sort({ createdTime: -1 }) || []
    ctx.success({
      count,
      page,
      pageSize,
      data
    })
  }
  async createTask(ctx) {
    const { userId } = ctx.request.query
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true,
        format: TASK_NAME_RE,
        emptyMessage: '任务名称不能为空',
        typeMessage: '任务名称必须为string类型',
        matchMessage: '任务名称只能包含英文、中文、数字和下划线，且不能超过20个字符'
      },
      content: {
        type: 'string',
        required: true,
        format: TASK_CONTENT_RE,
        emptyMessage: '任务内容不能为空',
        typeMessage: '任务内容必须为string类型',
        matchMessage: '任务内容只能包含英文、中文、数字和下划线，且不能超过200个字符'
      },
      remark: {
        type: 'string',
        typeMessage: '备注必须为string类型'
      },
      estimatedTime: {
        type: 'number',
        customVerify: val => val >= 0 ? undefined : '预计完成时间必须是有效的时间戳'
      }
    })
    const { name, content, remark, estimatedTime } = ctx.request.body
    await Task.create({
      userId,
      name,
      content,
      remark,
      estimatedTime
    })
    ctx.success()
  }
}

module.exports = new TaskCtl()