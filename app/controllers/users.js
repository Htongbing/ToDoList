const User = require('../models/users')
const { ACCOUNT_RE, PASSWORD_RE, EMAIL_RE, NOTICE_TIME_RE } = require('../const')
const md5 = require('md5')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../const/config')
const moment = require('moment')

class UsersCtl {
  async signUp(ctx) {
    const { account, password, email, verification_code } = ctx.request.body
    const { redis, cookies } = ctx
    const codeKey = `VERIFICATION:${cookies.get('verification_id')}`
    const code = await redis.get(codeKey)
    if (!code || verification_code.toLowerCase() !== code.toLowerCase()) ctx.throw(400, '验证码错误或者已过期')
    redis.del(codeKey)
    cookies.set('verification_id', null)
    ctx.verifyParams({
      account: {
        type: 'string',
        format: ACCOUNT_RE,
        required: true,
        emptyMessage: '帐号不能为空',
        typeMessage: '帐号必须为string类型',
        matchMessage: '帐号必须以字母开头，由字母或者数字组成，长度6-20'
      },
      password: {
        type: 'string',
        format: PASSWORD_RE,
        required: true,
        emptyMessage: '密码不能为空',
        typeMessage: '密码必须为string类型',
        matchMessage: '密码只能由数字和字母组成，且必须包含数字和字母，长度6-20'
      },
      email: {
        type: 'string',
        format: EMAIL_RE,
        required: true,
        emptyMessage: '邮箱不能为空',
        typeMessage: '邮箱必须为string类型',
        matchMessage: '邮箱格式不正确'
      }
    })
    const user = await User.findOne({
      $or: [{ account }, { email }]
    })
    if (user) ctx.throw(400, '帐号或邮箱已存在')
    const { id } = await User.create({
      account,
      email,
      password: md5(password)
    })
    ctx.success({id})
  }
  async signIn(ctx) {
    ctx.verifyParams({
      username: {
        type: 'string',
        required: true,
        emptyMessage: '用户名不能为空',
        typeMessage: '用户名必须为string类型'
      },
      password: {
        type: 'string',
        required: true,
        emptyMessage: '密码不能为空',
        typeMessage: '密码必须为string类型'
      }
    })
    const { username, password } = ctx.request.body
    const user = await User.findOne({
      $or: [{ account: username }, { email: username }]
    }).select('+password')
    if (!user) ctx.throw(400, '帐号或者邮箱不存在')
    const { id, account, password: realPassword, emailStatus, email } = user
    if (md5(password) !== realPassword) ctx.throw(400, '密码错误')
    const token = jsonwebtoken.sign({ id, account, email, emailStatus }, secret, { expiresIn: '1d' })
    ctx.success({ token, account, emailStatus, id })
  }
  async resetPassword(ctx) {
    ctx.verifyParams({
      password: {
        type: 'string',
        format: PASSWORD_RE,
        required: true,
        emptyMessage: '密码不能为空',
        typeMessage: '密码必须为string类型',
        matchMessage: '密码只能由数字和字母组成，且必须包含数字和字母，长度6-20'
      }
    })
    const { password } = ctx.request.body
    const { email } = ctx.state.user
    await User.findOneAndUpdate({ email }, { password: md5(password) })
    await ctx.redis.del(`EMAILLINKEX:${email}`)
    ctx.success()
  }
  async noticeSetting(ctx) {
    const { userId } = ctx.request.query
    const { needNotice, noticeTime } = ctx.request.body
    ctx.verifyParams({
      needNotice: {
        type: 'enum',
        values: [0, 1],
        required: true,
        emptyMessage: '是否提醒不能为空',
        matchMessage: '是否提醒的值只能是0、1'
      }
    })
    const options = { needNotice }
    if (needNotice === 1) {
      ctx.verifyParams({
        noticeTime: {
          type: 'string',
          format: NOTICE_TIME_RE,
          required: true,
          emptyMessage: '提醒时间不能为空',
          typeMessage: '提醒时间必须为string类型',
          matchMessage: '提醒时间必须是正确的格式，如"18:00"'
        }
      })
      options.noticeTime = noticeTime
      const now = new Date()
      const date = moment(now).format('YYYY-MM-DD')
      const time = new Date(`${date} ${noticeTime}`) < now ? new Date(`${date} 00:00:00`) - (-8.64e7) : + new Date(`${date} 00:00:00`)
      options.nextNoticeTime = time
    } else {
      options.noticeTime = null
      options.nextNoticeTime = null
    }
    await User.findByIdAndUpdate(userId, options)
    ctx.success()
  }
  async getNoticeSetting(ctx) {
    const { userId } = ctx.request.query
    const { noticeTime, needNotice } = await User.findById(userId)
    ctx.success({ noticeTime, needNotice })
  }
}

module.exports = new UsersCtl()