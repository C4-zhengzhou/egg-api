module.exports = app => {
  const option = app.controller.v1.option

  app.router.resources('/api/v1/option', option)
}
