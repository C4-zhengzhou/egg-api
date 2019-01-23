const shortid = require('shortid')

module.exports = class extends require('egg').Service {
  generateFileName(val) {
    return shortid.generate() + '.' + val.split('.')[1]
  }
}
