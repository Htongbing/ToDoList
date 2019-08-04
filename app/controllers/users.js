const User = require('../models/users')

class UsersCtl {
  async signUp(ctx) {
    ctx.verifyParams({
      account: {
        type: 'string',
        require: true
      },
      password: {
        type: 'string',
        require: true
      }
    })
    const user = await User.create(ctx.request.body)
    if (!user) { ctx.throw(412, '帐号已存在') }
    ctx.body = user
  }
}

module.exports = new UsersCtl()