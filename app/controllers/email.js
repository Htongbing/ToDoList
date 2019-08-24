const nodemailer = require('nodemailer')
const { EMAIL, EMAIL_KEY, EMAIL_HOST } = process.env
const { createRandomCode } = require('../utils')
const { EMAIL_CODE_TIME } = require('../const')

class EmailCtl {
  async sendVerificationCode(toEmail) {
    const code = createRandomCode()
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
    const mailOptions = {
      from: `"ToDoList" <${EMAIL}>`,
      subject: '验证码',
      to: `${toEmail}`,
      html: `<h1>欢迎使用ToDoList，您的邮箱验证码为：${code}，${Math.floor(EMAIL_CODE_TIME / 60)}分钟内有效</h1>`
    }
    try {
      await transporter.sendMail(mailOptions)
    } catch (e) {
      console.log(e)
    } finally {
      return code
    }
  }
}

module.exports = new EmailCtl()