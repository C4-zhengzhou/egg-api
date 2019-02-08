module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
  }
  async current() {
    if (!this.ctx.state.user) {
      this.error('签名失效')
    } else {
      const res = {
        jwtData: this.ctx.state.user,
        issuerAt: this.ctx.helper.formatTime(this.ctx.state.user.iat * 1000),
        expiresIn: this.ctx.helper.formatTime(this.ctx.state.user.exp * 1000)
      }
      if (this.service.auth.isAdmin()) {
        this.success({
          ...res,
          admin: await this.ctx.model['Admin'].findById(
            this.ctx.state.user.adminId
          )
        })
      } else {
        this.success({
          ...res,
          user: await this.ctx.model['User'].findById(
            this.ctx.state.user.userId
          )
        })
      }
    }
  }
  async refresh() {
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
  async token() {
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
}
