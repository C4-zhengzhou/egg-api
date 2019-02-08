module.exports = class extends require('egg').Service {
  constructor(app) {
    super(app)
    this.user = this.ctx.state.user
    this.error = this.ctx.helper.error
  }
  addAccount(payload) {
    return new Promise(async (resolve, reject) => {
      let user = await this.ctx.model['User'].findOne({
        phone: payload.phone
      })
      if (user) {
        user.nickName = '管理员用户' + payload.phone.substr(-4)
        user.password = payload.password
        user.role = 'user'
        await user.save()
      }
      let newUserData = {
        ...payload,
        nickName: payload.nickName || '管理员用户' + payload.phone.substr(-4),
        available: true,
        role: 'user'
      }
      const newUser = await this.ctx.model['User'].create(newUserData)
      payload.user = newUser._id
      resolve(await this.ctx.model['Admin'].create(payload))
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
        user.nickName = admin.nickName
        user.password = payload.password
        await user.save()
        resolve()
      }
    })
  }
}
