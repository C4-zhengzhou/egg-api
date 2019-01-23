const crypto = require('crypto')

module.exports = class extends require('egg').Service {
  constructor(app) {
    super(app)
    this.throw = message => {
      this.ctx.throw(422, message)
    }
  }
  require() {
    for (let i of arguments) {
      if (!this.ctx.request.body[i]) {
        this.throw(`${i} 不存在`)
      }
    }
  }
  isMobile(val) {
    var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    if (!val.match(reg)) {
      this.throw(`${val} 不是合法的手机号`)
    }
  }
  isEmail(val) {
    var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
    if (!val.match(reg)) {
      this.throw(`${val} 不是合法的电子邮箱`)
    }
  }
  minLength(val, length) {
    length = Number(length) || 1
    if (val.length < length) {
      this.throw(`${val} 长度不能小于 ${length} 位`)
    }
  }
  maxLength(val, length) {
    length = Number(length) || 10
    if (val.length > length) {
      this.throw(`${val} 长度不能大于 ${length} 位`)
    }
  }
}
