const crypto = require('crypto')

module.exports = class extends require('egg').Service {
  constructor(app) {
    super(app)
    this.user = this.ctx.state.user
    this.error = this.ctx.helper.error
    this.throw = message => {
      this.ctx.throw(401, message)
    }
  }
  requireLogin() {
    if (!this.user) {
      this.throw('需要先登陆用户')
    }
  }
  requireAdmin() {
    this.requireLogin()
    if (this.user.role !== 'admin' || this.user.role !== 'superAdmin') {
      this.throw(`当前用户不是管理员`)
    }
  }
  isLogin() {
    return !!this.user && this.user._id
  }
  isAdmin() {
    return !!this.user && this.user._id && this.user.role === 'admin'
  }
}
