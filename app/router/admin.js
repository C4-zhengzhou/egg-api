module.exports = app => {
  const admin = app.controller.v1.admin

  app.router.resources('/api/v1/admin', admin)
}
