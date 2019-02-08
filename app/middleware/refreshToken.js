module.exports = (options, app) => {
  return async function(ctx, next) {
    if (ctx.state.user) {
      if (ctx.state.user.exp * 1000 - Date.now() < app.config.jwt.refreshTime) {
        ctx.set('Access-Control-Expose-Headers', 'x-new-token')
        ctx.set('x-new-token', ctx.service.encrypt.refreshJwt())
      }
    }
    await next()
  }
}
