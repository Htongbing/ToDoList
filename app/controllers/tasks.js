const Task = require('../models/tasks')
const { TASK_NAME_RE, TASK_CONTENT_RE } = require('../const')
const STATUS = ['0', '1', '2']

class TaskCtl {
  async getList(ctx) {
    let { userId, page, pageSize, name, status, createdTimeForm, createdTimeTo } = ctx.request.query
    page = page < 1 ? 1 : Math.floor(Number(page)) || 1
    pageSize = pageSize < 1 ? 10 : Math.floor(Number(pageSize)) || 10
    const searchOptions = {
      userId,
      name: { $regex: name ? name : '' },
      createdTime: {
        $gte: createdTimeForm > 0 ? Number(createdTimeForm) : 0
      }
    }
    STATUS.includes(status) && (searchOptions.status = Number(status))
    createdTimeTo > 0 && (searchOptions.createdTime.$lte = Number(createdTimeTo))
    const count = await Task.find(searchOptions).countDocuments()
    const data = await Task.find(searchOptions).skip((page - 1) * pageSize).limit(pageSize).sort({ createdTime: -1 }) || []
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
        matchMessage: '任务内容不能超过200个字符'
      },
      remark: {
        type: 'string',
        format: TASK_CONTENT_RE,
        typeMessage: '备注必须为string类型',
        matchMessage: '备注不能超过200个字符'
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
  async updateTask(ctx) {
    const { id } = ctx.params
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
      remark: {
        type: 'string',
        format: TASK_CONTENT_RE,
        typeMessage: '备注必须为string类型',
        matchMessage: '备注不能超过200个字符'
      }
    })
    const { name, remark } = ctx.request.body
    try {
      const task = await Task.findOneAndUpdate({ _id: id, userId }, { name, remark })
      if (!task) throw new Error()
      ctx.success()
    } catch (e) {
      ctx.throw(400, '任务不存在')
    }
  }
  async deleteTask(ctx) {
    const ids = ctx.params.ids.split(',')
    const { userId } = ctx.request.query
    await Task.deleteMany({userId, _id: { $in: ids }})
    ctx.success()
  }
}

module.exports = new TaskCtl()