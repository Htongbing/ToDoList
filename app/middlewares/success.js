module.exports = function(app) {
  app.context.success = function(data) {
    this.status = 200
    this.body = {
      code: 0,
      message: 'success',
      data: data || null
    }
  }
  return async (ctx, next) => {
    await next()
  }
}