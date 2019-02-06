module.exports = appInfo => {
  const config = (exports = {})

  config.keys = appInfo.name + '_1234_5678'
  // 用户密码加盐字段
  config.passwordSalt = 'c4-password-salt'
  // 微信开发ID和Key
  config.wx = {
    appid: 'wx-mp-appid',
    secret: 'wx-mp-secret'
  }
  // 阿里云key和oss配置
  config.aliyun = {
    accessKeyId: 'ali-key-id',
    accessKeySecret: 'ali-key-secret',
    region: 'oss-cn-beijing',
    bucket: 'quincy-dev-temp'
  }
  // jwt配置
  config.jwt = {
    enable: true,
    passthrough: true,
    // jwt加盐字段
    secret: 'C4-jwt-salt',
    match: '/',
    getToken(ctx) {
      // 请求头部携带的jwt字段名
      return ctx.request.header['x-c4-token'] || ''
    },
    // token过期时间
    expiresIn: '2h'
  }
  config.cluster = {
    listen: {
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
