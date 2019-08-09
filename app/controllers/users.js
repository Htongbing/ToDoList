const User = require('../models/users')

class UsersCtl {
  async signUp(ctx) {
    ctx.verifyParams({
      account: {
        type: 'string',
        format: /^[a-z][a-z\d]{5,19}$/i,
        required: true,
        emptyMessage: '帐号不能为空',
        typeMessage: '帐号必须为string类型',
        matchMessage: '帐号必须以字母开头，由字母或者数字组成，长度6-20'
      },
      password: {
        type: 'string',
        format: /^(?=[a-z]*\d)(?=\d*[a-z])[a-z\d]{6,20}$/i,
        required: true,
        emptyMessage: '密码不能为空',
        typeMessage: '密码必须为string类型',
        matchMessage: '密码只能由数字和字母组成，且必须包含数字和字母，长度6-20'
      }
    })
    const data = ctx.request.body, user = await User.findOne({ account: data.account })
    if (user) ctx.throw(412, '帐号已存在')
    const { id } = await User.create(data)
    ctx.success('注册成功', {id})
  }
}

module.exports = new UsersCtl()