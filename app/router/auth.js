module.exports = app => {
  const auth = app.controller.v1.auth

  app.router.get('/api/v1/auth/current', auth.current)
  app.router.get('/api/v1/auth/refresh', auth.refresh)
}
