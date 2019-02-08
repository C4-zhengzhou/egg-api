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
    if (!this.service.auth.isAdmin()) {
      this.throw(`当前用户不是管理员`)
    }
  }
  async userId() {
    if (this.user.adminId) {
      return (await this.ctx.model['Admin'].findById(this.user.adminId)).user
    } else {
      return this.user.userId
    }
  }
  isLogin() {
    return !!this.user && this.user.role
  }
  isAdmin() {
    return this.user.adminId && this.config.adminRoles.includes(this.user.role)
  }
}
