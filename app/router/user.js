module.exports = app => {
  const user = app.controller.v1.user

  // app.router.post('/api/v1/admin/register', user.registerAdmin)
  // app.router.post('/api/v1/admin/login', user.adminLogin)

  // app.router.get('/api/v1/user/:id/faviInfo', user.faviInfoList)
  // app.router.get('/api/v1/user/:id/info', user.infoList)
  // app.router.post('/api/v1/user/wxRegister', user.wxRegister)
  // app.router.post('/api/v1/user/wxLogin', user.wxLogin)
  // app.router.post('/api/v1/user/bindPhone', user.bindPhone)

  app.router.resources('/api/v1/user', user)
}
