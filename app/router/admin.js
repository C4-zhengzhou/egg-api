module.exports = app => {
  const admin = app.controller.v1.admin

  // app.router.post('/api/v1/admin/register', user.registerAdmin)
  // app.router.post('/api/v1/admin/login', user.adminLogin)

  // app.router.get('/api/v1/user/:id/faviInfo', user.faviInfoList)
  // app.router.get('/api/v1/user/:id/info', user.infoList)
  // app.router.post('/api/v1/user/wxRegister', user.wxRegister)
  // app.router.post('/api/v1/user/wxLogin', user.wxLogin)
  // app.router.post('/api/v1/user/bindPhone', user.bindPhone)
  // app.router.get('/api/v1/user/refresh', user.getCurrentUserInfo)

  app.router.resources('/api/v1/admin', admin)
}