const nodemailer = require('nodemailer')
const { EMAIL, EMAIL_KEY, EMAIL_HOST } = process.env
const { createRandomCode } = require('../utils')
const { EMAIL_CODE_TIME, EMAIL_CODE_EX_TIME, RESET_PASSWORD_URL, NOTICE_TIME_RE } = require('../const')
const User = require('../models/users')
const Task = require('../models/tasks')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../const/config')
const EX_TIME = Math.floor(EMAIL_CODE_TIME / 60)
const moment = require('moment')

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  secureConnection: true,
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_KEY
  }
})

class EmailCtl {
  async sendVerificationCode(ctx) {
    const { emailStatus, account, email } = ctx.state.user
    if (emailStatus === 1) ctx.throw(400, '邮箱已验证')
    const { redis } = ctx
    const curCode = await redis.get(`EMAILCODEEX:${account}`)
    if (curCode) ctx.throw(400, '验证码已发出')
    const code = createRandomCode()
    const mailOptions = {
      from: `"ToDoList" <${EMAIL}>`,
      subject: '验证码',
      to: `${email}`,
      html: `<h1>欢迎使用ToDoList，您的邮箱验证码为：${code}，${EX_TIME}分钟内有效</h1>`
    }
    try {
      await transporter.sendMail(mailOptions)
      await redis.set(`EMAILCODE:${account}`, code, 'EX', EMAIL_CODE_TIME)
      await redis.set(`EMAILCODEEX:${account}`, 'ToDoList', 'EX', EMAIL_CODE_EX_TIME)
      ctx.success()
    } catch (e) {
      ctx.throw(500, '邮箱验证码发送失败')
    }
  }
  async verify(ctx) {
    const { emailStatus, id, account, email } = ctx.state.user
    if (emailStatus === 1) ctx.throw(400, '邮箱已验证')
    const { redis } = ctx
    const codeKey = `EMAILCODE:${account}`
    const code = await redis.get(codeKey)
    if (String(ctx.request.body.code) !== code) ctx.throw(400, '邮箱验证码错误')
    await User.findByIdAndUpdate(id, { emailStatus: 1 })
    await redis.del(codeKey)
    const token = jsonwebtoken.sign({ id, account, email, emailStatus: 1 }, secret, { expiresIn: '1d' })
    ctx.success({ token })
  }
  async forgot(ctx) {
    const { account } = ctx.request.body
    const user = await User.findOne({ account })
    if (!user) ctx.throw(400, '用户不存在')
    const { email, emailStatus } = user
    if (emailStatus !== 1) ctx.throw(400, '邮箱未验证')
    const { redis } = ctx
    const curCode = await redis.get(`EMAILLINKEX:${account}`)
    if (curCode) ctx.throw(400, '邮件已发出') 
    const token = jsonwebtoken.sign({ account }, secret, { expiresIn: `${EX_TIME}m` })
    const url = `${RESET_PASSWORD_URL}?token=${token}`
    const mailOptions = {
      from: `"ToDoList" <${EMAIL}>`,
      subject: '重置密码',
      to: `${email}`,
      html: `<h1>欢迎使用ToDoList，点击下面的链接重置密码，链接${EX_TIME}分钟内有效</h1><a href="${url}">${url}</a>`
    }
    try {
      await transporter.sendMail(mailOptions)
      await redis.set(`EMAILLINKEX:${account}`, 'ToDoList', 'EX', EMAIL_CODE_TIME)
      ctx.success()
    } catch (e) {
      ctx.throw(500, '邮件发送失败')
    }
  }
  async timingEmail() {
    const now = new Date()
    const targetDate = moment(now).format('YYYY-MM-DD')
    const users = await User.find({ needNotice: 1, noticeTime: NOTICE_TIME_RE, nextNoticeTime: { $lte: + now } })
    const ids = []
    users.forEach(async ({noticeTime, email, id, account}) => {
      if (now >= new Date(`${targetDate} ${noticeTime}`)) {
        ids.push(id)
        const tasks = await Task.find({ userId: id, status: { $in: [0, 2] } })
        if (tasks.length) {
          const str = `<h3>${account}，欢迎使用ToDoList，下列是未完成的任务提醒</h3>`
          const mailOptions = {
            from: `"ToDoList" <${EMAIL}>`,
            subject: '任务提醒',
            to: `${email}`,
            html: `${str}${tasks.map(({name, estimatedTime}) => {
              return `<div style="margin-top:60px;"><p>任务名：${name}</p><p>预计完成时间：${estimatedTime ? moment(estimatedTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</p></div>`
            }).join('')}`
          }
          transporter.sendMail(mailOptions)
        }
      }
    })
    return await User.updateMany({ _id: { $in: ids } }, { nextNoticeTime: moment(new Date(`${targetDate} 00:00:00`) - (-8.64e7)) })
  }
}

module.exports = new EmailCtl()