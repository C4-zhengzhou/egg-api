module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.successWithPage = this.ctx.helper.successWithPage
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.model = this.ctx.model['User']
    this.accountRule = {
      account: {
        type: 'string',
        required: true,
        min: 6,
        max: 16
      }
    }
    this.phoneRule = {
      phone: {
        type: 'string',
        required: true,
        format: /^[0-9]{11}$/
      }
    }
    this.emailRule = {
      email: {
        type: 'email',
        required: true
      }
    }
    this.passwordRule = {
      password: {
        type: 'password',
        required: true,
        min: 6,
        max: 16
      }
    }
  }
  async registerByPhone() {
    this.ctx.validate(this.phoneRule)
    let payload = this.ctx.request.body
    if (await this.model.findOne({ phone: payload.phone })) {
      this.error(`手机号 ${payload.phone} 已经注册`)
    } else {
      const newUser = await this.model.create({
        phone: payload.phone,
        nickName: payload.nickName
          ? payload.nickName
          : `用户${payload.phone.substr(-4)}`,
        password: payload.password
          ? this.service.encrypt.signPassword(payload.password)
          : undefined,
        role: 'user'
      })
      this.success(`新账号 ${newUser.nickName} 注册成功`)
    }
  }
  async loginByPhone() {
    this.ctx.validate(this.phoneRule)
    this.ctx.validate(this.passwordRule)
    const payload = this.ctx.request.body
    let user = await this.model.findOne({ phone: payload.phone })
    if (!user) {
      this.error(`手机号 ${payload.phone} 不存在`)
    } else {
      const password = this.service.encrypt.signPassword(payload.password)
      if (user.password !== password) {
        this.error(`密码验证失败`)
      } else {
        user.lastLoginTime = Date.now()
        const newUserData = await user.save()
        this.success({
          _id: newUserData._id,
          phone: newUserData.phone,
          avatar: newUserData.avatar,
          nickName: newUserData.nickName,
          role: newUserData.role,
          token: this.service.encrypt.signUserJwt(newUserData)
        })
      }
    }
  }
  async addPhone() {
    this.ctx.validate(this.phoneRule)
    const payload = this.ctx.request.body
    if (!this.ctx.state.user) {
      this.error('身份验证错误')
    } else {
      let user = await this.model.findById(this.ctx.state.user._id)
      user.phone = payload.phone
      await user.save()
      this.success('绑定手机号成功')
    }
  }
  async wxLogin() {
    const payload = this.ctx.request.body
    const wxData = (await this.ctx.curl(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${
        this.config.wx.appid
      }&secret=${this.config.wx.secret}&js_code=${
        payload.code
      }&grant_type=authorization_code`,
      { dataType: 'json' }
    )).data
    const user = await this.model.findOne({
      wxid: wxData.openid
    })
    if (user) {
      this.success({
        _id: user._id,
        phone: user.phone,
        avatar: user.avatar,
        nickName: user.nickName,
        role: user.role,
        token: this.service.encrypt.signUserJwt(user)
      })
    } else {
      this.error('当前用户未注册')
    }
  }
  async wxRegister() {
    const userInfo = this.ctx.request.body
    const user = await this.model.create({
      wxid: userInfo.openid,
      avatar: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      gender: userInfo.gender,
      province: userInfo.province,
      city: userInfo.city,
      country: userInfo.country,
      role: 'wxuser'
    })
    this.success({
      _id: user._id,
      phone: user.phone,
      avatar: user.avatar,
      nickName: user.nickName,
      role: user.role,
      token: this.service.encrypt.signUserJwt(user)
    })
  }
  async changePassword() {
    this.ctx.validate({
      oldPassword: {
        type: 'password',
        required: true,
        min: 6,
        max: 16
      },
      newPassword: {
        type: 'password',
        compare: 'newPassword2',
        required: true,
        min: 6,
        max: 16
      },
      newPassword2: {
        type: 'password',
        required: true,
        min: 6,
        max: 16
      }
    })
    const payload = this.ctx.request.body
    let user = await this.model.findById(this.ctx.state.user.user)
    if (
      user.password !== this.service.encrypt.signPassword(payload.oldPassword)
    ) {
      this.error(`原密码验证失败`)
    } else {
      user.password = payload.newPassword
      await user.save()
      this.success('密码修改成功')
    }
  }
  async index() {
    const req = this.ctx.query
    let query = {}
    if (req.role) query.role = req.role
    if (req.state) query.state = req.state
    const page = {
      page: Number(this.ctx.query.page) || 1,
      size: Number(this.ctx.query.size) || 10,
      total: await this.model
        .find(query)
        .count()
        .exec()
    }
    const list = await this.model
      .find(query)
      .sort(req.sort || '-createTime')
      .skip(page.size * (page.page - 1))
      .limit(page.size)
      .exec()
    this.successWithPage(this.service.filter.filterData(list), page)
  }
  async create() {
    this.service.auth.requireAdmin()
    const payload = this.ctx.request.body
    payload.account ? this.ctx.validate(this.accountRule) : null
    payload.phone ? this.ctx.validate(this.phoneRule) : null
    payload.email ? this.ctx.validate(this.emailRule) : null
    if (
      payload.account &&
      (await this.model.findOne({ account: payload.account }))
    ) {
      this.error(`账号 ${payload.account} 已经注册`)
    } else if (
      payload.phone &&
      (await this.model.findOne({ phone: payload.phone }))
    ) {
      this.error(`手机号 ${payload.phone} 已经注册`)
    } else if (
      payload.email &&
      (await this.model.findOne({ email: payload.email }))
    ) {
      this.error(`邮箱 ${payload.email} 已经注册`)
    } else {
      payload.password = this.service.encrypt.signPassword(payload.password)
      this.model.create(payload)
      this.success(
        `新账号 ${payload.account} - ${payload.phone} - ${
          payload.email
        } 添加成功`
      )
    }
  }
  async show() {
    this.service.auth.requireAdmin()
    const result = await this.model.findById(this.ctx.params.id)
    if (result) {
      this.success(result)
    } else {
      this.error('资源不存在')
    }
  }
  async update() {
    this.service.auth.requireLogin()
    this.success(
      await this.model.findByIdAndUpdate(
        this.ctx.params.id,
        this.ctx.request.body,
        { new: true }
      )
    )
  }
  async destroy() {
    this.service.auth.requireAdmin()
    this.success(await this.model.findByIdAndRemove(this.ctx.params.id))
  }
}
