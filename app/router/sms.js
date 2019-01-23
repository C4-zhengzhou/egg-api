module.exports = app => {
  const sms = app.controller.v1.sms

  app.router.post('/api/v1/sms/register', sms.register)
  app.router.post('/api/v1/sms/login', sms.login)
}
