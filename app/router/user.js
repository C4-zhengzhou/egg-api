module.exports = app => {
  const user = app.controller.v1.user

  app.router.resources('/api/v1/user', user)
}
