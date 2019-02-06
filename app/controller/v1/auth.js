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
      const user = await this.model.findById(this.ctx.state.user._id)
      this.success(user)
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
