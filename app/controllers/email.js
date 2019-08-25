const nodemailer = require('nodemailer')
const { EMAIL, EMAIL_KEY, EMAIL_HOST } = process.env
const { createRandomCode } = require('../utils')
const { EMAIL_CODE_TIME, EMAIL_CODE_EX_TIME } = require('../const')

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
      html: `<h1>欢迎使用ToDoList，您的邮箱验证码为：${code}，${Math.floor(EMAIL_CODE_TIME / 60)}分钟内有效</h1>`
    }
    try {
      await transporter.sendMail(mailOptions)
      await redis.set(`EMAILCODE:${account}`, code, 'EX', EMAIL_CODE_TIME)
      await redis.set(`EMAILCODEEX:${account}`, 'ToDoList', 'EX', EMAIL_CODE_EX_TIME)
    } catch (e) {
      ctx.throw(500, '邮箱验证码发送失败')
    }
    ctx.success()
  }
}

module.exports = new EmailCtl()