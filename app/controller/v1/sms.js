module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.rule = {
      phone: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[0-9]{11}$/
      }
    }
  }
  async register() {
    this.ctx.validate(this.rule)
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
  async login() {
    this.ctx.validate(this.rule)
    const payload = this.ctx.request.body
    this.success(`sms to ${payload.phone} ok`)
  }
}
