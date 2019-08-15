const uuidv4 = require('uuid/v4')
const svgCaptcha = require('svg-captcha')
const { VERIFICATION_TIME } = require('../const')

class CodesCtl {
  async getCode(ctx) {
    const {data, text} = svgCaptcha.create(), uuid = uuidv4(), { redis, cookies } = ctx
    redis.del(`VERIFICATION:${cookies.get('verification_id')}`)
    cookies.set('verification_id', uuid, {
      maxAge: VERIFICATION_TIME,
      httpOnly: true
    })
    redis.set(`VERIFICATION:${uuid}`, text, 'EX', VERIFICATION_TIME / 1000)
    ctx.type = 'image/svg+xml'
    ctx.status = 200
    ctx.body = data
  }
}

module.exports = new CodesCtl()