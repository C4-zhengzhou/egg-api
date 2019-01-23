const passwordSalt = 'c4-password-salt'
const jwtSalt = 'C4-jwt-salt'

module.exports = appInfo => {
  const config = (exports = {})

  config.keys = appInfo.name + '_1234_5678'
  config.passwordSalt = passwordSalt
  config.wx = {
    appid: 'wx-mp-appid',
    secret: 'wx-mp-secret'
  }
  config.aliyun = {
    accessKeyId: 'ali-key-id',
    accessKeySecret: 'ali-key-secret',
    region: 'oss-cn-beijing',
    bucket: 'dev-temp'
  }
  config.jwt = {
    enable: true,
    passthrough: true,
    secret: jwtSalt,
    match: '/auth',
    getToken(ctx) {
      return ctx.request.header['x-c4-token']
    },
    option: {
      expiresIn: '30d'
    }
  }
  config.cluster = {
    listen: {
      port: 3000,
      hostname: '127.0.0.1'
    }
  }
  config.mongoose = {
    options: {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0
    }
  }
  config.middleware = ['errorHandler']
  config.errorHandler = {
    match: '/api'
  }
  config.security = {
    csrf: {
      enable: false
    }
  }
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS,PATCH'
  }
  config.multipart = {
    fileExtensions: [
      '.apk',
      '.pptx',
      '.docx',
      '.csv',
      '.doc',
      '.ppt',
      '.pdf',
      '.pages',
      '.wav',
      '.mov'
    ]
  }
  config.bcrypt = {
    saltRounds: 10
  }

  return config
}
