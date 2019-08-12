const User = require('../models/users')
const { ACCOUNT_RE, PASSWORD_RE, EMAIL_RE } = require('../const')
const md5 = require('md5')

class UsersCtl {
  async signUp(ctx) {
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
    const { account, password, email } = ctx.request.body, user = await User.findOne({
      $or: [{ account }, { email }]
    })
    if (user) ctx.throw(412, '帐号或邮箱已存在')
    const { id } = await User.create({
      account,
      email,
      password: md5(password)
    })
    ctx.success('注册成功', {id})
  }
}

module.exports = new UsersCtl()