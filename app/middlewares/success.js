module.exports = function(app) {
  app.context.success = function(message, data) {
    this.status = 200
    this.body = {
      code: 0,
      message: message || '',
      data: data || null
    }
  }
  return async (ctx, next) => {
    await next()
  }
}