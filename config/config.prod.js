// production环境下的配置

module.exports = appInfo => {
  const config = (exports = {})

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/c4',
    options: {
      user: 'c4',
      pass: 'c4'
    }
  }

  return config
}
