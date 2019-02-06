module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.rule = {
      phone: {
        type: 'string',
        required: true,
        format: /^[0-9]{11}$/
      }
    }
  }
  async registerAdminCode() {
    this.ctx.validate(this.rule)
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
  async updateAdminCode() {
    this.ctx.validate(this.rule)
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
  async loginAdminCode() {
    this.ctx.validate(this.rule)
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
  async registerUserCode() {
    this.ctx.validate(this.rule)
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
  async updateUserCode() {
    this.ctx.validate(this.rule)
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
  async loginUserCode() {
    this.ctx.validate(this.rule)
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
}
