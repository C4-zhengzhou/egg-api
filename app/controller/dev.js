module.exports = class extends require('egg').Controller {
  async ping() {
    if (this.ctx.state.user) {
      this.ctx.helper.success({ state: '已经登陆', user: this.ctx.state.user })
    } else {
      this.ctx.helper.success('hi, egg-RESTfulAPI! service ok')
    }
  }
}
