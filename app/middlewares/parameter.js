const Parameter = require('../utils/parameter')

module.exports = function(app) {
  app.context.verifyParams = function(rules, params) {
    if (!rules) return
    if (!params) {
      params = this.request[['GET', 'HEAD'].includes(this.method.toUpperCase()) ? 'query' : 'body']
    }
    const parameter = new Parameter(), errors = parameter.validate(rules, params)
    if (!errors) return
    this.throw(422, errors.join('\n'))
  }
  return async (ctx, next) => {
    await next()
  }
}