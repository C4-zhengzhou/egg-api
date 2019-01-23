module.exports = app => {
  app.router.get('/', 'dev.ping')
  app.router.get('/ping', 'dev.ping')
}
