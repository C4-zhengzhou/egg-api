// 开发环境下的配置

module.exports = appInfo => {
  const config = (exports = {})

  config.mongoose = {
    url: 'mongodb://192.168.1.222:27017/c4',
    options: {
      user: '',
      pass: ''
    }
  }

  return config
}
