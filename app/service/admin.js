const crypto = require('crypto')

module.exports = class extends require('egg').Service {
  constructor(app) {
    super(app)
    this.user = this.ctx.state.user
    this.error = this.ctx.helper.error
  }
  addAccount(payload) {
    return new Promise(async (resolve, reject) => {
      const user = await this.ctx.model['User'].findOne({
        phone: payload.phone
      })
      if (user) {
        this.error('用户已存在')
      } else {
        payload.nickName = '管理员用户' + payload.phone.substr(-4)
        const newUser = await this.ctx.model['User'].create(payload)
        payload.user = newUser._id
        const admin = await this.ctx.model['Admin'].create(payload)
        resolve(admin)
      }
    })
  }
  syncToUser(id) {
    return new Promise(async (resolve, reject) => {
      let admin = await this.ctx.model['Admin'].findById(id)
      let user = await this.ctx.model['User'].findById(admin.user)
      if (!user) {
        user = await this.ctx.model['User'].create(admin)
        await user.save()
        resolve()
      } else {
        user = Object.assign(user, admin)
        await user.save()
        resolve()
      }
    })
  }
}
