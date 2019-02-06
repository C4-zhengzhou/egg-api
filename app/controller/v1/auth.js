module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
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
