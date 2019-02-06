module.exports = app => {
  const message = app.controller.v1.message

  app.router.resources('/api/v1/message', message)
}
