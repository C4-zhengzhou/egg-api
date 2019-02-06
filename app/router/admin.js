module.exports = app => {
  const admin = app.controller.v1.admin

  app.router.post('/api/v1/admin/login', admin.login)
  app.router.resources('/api/v1/admin', admin)
}
