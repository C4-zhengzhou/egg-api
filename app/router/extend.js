module.exports = app => {
  const sms = app.controller.v1.sms
  const upload = app.controller.v1.upload

  // app.router.post('/api/v1/sms/register', sms.register)
  // app.router.post('/api/v1/sms/login', sms.login)

  app.router.get('/', 'dev.ping')
  app.router.get('/ping', 'dev.ping')
}
