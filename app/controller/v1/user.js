module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.successWithPage = this.ctx.helper.successWithPage
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.model = this.ctx.model['Users']
  }
  async getRegisterSmsCode() {
    let payload = this.ctx.request.body
    this.service.validate.require('phone')
    this.service.validate.isMobile(payload.phone)
    this.success('sms ok')
  }
  async registerByPhone() {
    let payload = this.ctx.request.body
    this.service.validate.require('phone', 'password')
    this.service.validate.isMobile(payload.phone)
    this.service.validate.minLength(payload.password, 6)
    if (await this.model.findOne({ phone: payload.phone })) {
      this.error(`手机号 ${payload.phone} 已经注册`)
    } else {
      this.model.create({
        phone: payload.phone,
        userName: payload.userName
          ? payload.userName
          : `用户${payload.phone.slice(7, 11)}`,
        password: this.service.encrypt.signPassword(payload.password),
        role: 'user'
      })
      this.success(`新账号 ${payload.phone} 注册成功`)
    }
  }
  async loginByPhone() {
    const payload = this.ctx.request.body
    this.service.validate.require('phone', 'password')
    this.service.validate.isMobile(payload.phone)
    this.service.validate.minLength(payload.password, 6)
    let user = await this.model.findOne({ phone: payload.phone })
    if (!user) {
      this.error(`手机号 ${payload.phone} 不存在`)
    } else {
      const password = this.service.encrypt.signPassword(payload.password)
      if (user.password != password) {
        this.error(`密码验证失败`)
      } else {
        const token = this.app.jwt.sign(
          {
            _id: user._id,
            role: user.role
          },
          this.config.jwt.secret
        )
        this.success({
          _id: user._id,
          phone: user.phone,
          avatar: user.avatar,
          userName: user.userName,
          role: user.role,
          token
        })
        user.lastLoginTime = Date.now()
        await user.save()
      }
    }
  }
  async registerAdmin() {
    const payload = this.ctx.request.body
    const user = await this.model.findOne({
      phoneNum: payload.phoneNum
    })
    if (user) {
      this.error(`手机号${payload.phoneNum}已经注册`)
    } else {
      let newUser = await this.model.create({
        phoneNum: payload.phoneNum,
        userName: payload.userName,
        password: this.service.encrypt.signPassword(payload.password),
        avatar:
          payload.avatar ||
          'https://quincy-dev-temp.oss-cn-beijing.aliyuncs.com/qtt/img/userFace.jpg',
        isPhoneVerify: true,
        role: 'admin',
        state: 'normal'
      })
      this.success(`新用户${newUser.phoneNum}注册成功`)
    }
  }
  async adminLogin() {
    const payload = this.ctx.request.body
    const user = await this.model.findOne({
      phoneNum: payload.phoneNum
    })
    if (!user) {
      this.error(`用户${payload.phoneNum}不存在`)
    } else if (
      user.password !== this.service.encrypt.signPassword(payload.password)
    ) {
      this.error(`密码错误`)
    } else if (!user.isPhoneVerify) {
      this.error(`用户手机号未通过验证`)
    } else {
      user.token = this.service.encrypt.signJwt(user)
      this.success(user)
    }
  }
  async wxLogin() {
    const service = this.service
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
        phoneNum: user.phoneNum,
        isPhoneVerify: user.isPhoneVerify,
        avatar: user.avatar,
        userName: user.userName,
        role: user.role,
        token: service.encrypt.signJwt(user)
      })
    } else {
      this.error({ openid: wxData.openid, msg: '当前用户不存在' })
    }
  }
  async wxRegister() {
    const userInfo = this.ctx.request.body
    let newUser = await this.model.create({
      wxid: userInfo.openid,
      avatar: userInfo.avatarUrl,
      userName: userInfo.nickName,
      gender: userInfo.gender,
      province: userInfo.province,
      city: userInfo.city,
      country: userInfo.country,
      role: 'wxuser',
      state: 'normal'
    })
    this.success({
      _id: newUser._id,
      isPhoneVerify: newUser.isPhoneVerify,
      avatar: newUser.avatar,
      userName: newUser.userName,
      role: newUser.role,
      token: this.service.encrypt.signJwt(newUser)
    })
  }
  async bindPhone() {
    if (!this.ctx.state.user) {
      this.error('身份验证错误')
    } else {
      let user = await this.model.findById(this.ctx.state.user._id)
      user.phoneNum = this.ctx.request.body.phoneNum
      user.isPhoneVerify = true
      user.save()
      this.success('绑定手机号成功')
    }
  }
  async getCurrentUserInfo() {
    if (!this.ctx.state.user) {
      this.error('签名失效')
    } else {
      let result = await this.model.findById(this.ctx.state.user._id)
      if (result) {
        if (this.service.encrypt.isTokenExp()) {
          service.send.error('当前用户登录信息过期，请重新授权', 401)
        } else {
          this.success(result)
        }
      } else {
        this.error('资源不存在')
      }
    }
  }
  async changePassword() {
    const payload = this.ctx.request.body
    this.service.validate.require('oldPassword', 'newPassword')
    this.service.validate.minLength(payload.newPassword, 6)
  }
  async faviInfoList() {
    const userId = this.ctx.params.id
    if (this.ctx.state.user._id !== userId && this.service.role.isAdmin()) {
      this.error('权限不足')
    } else {
      // const Infos = this.ctx.model['Infos']
      const user = await this.model
        .findById(userId)
        .populate({
          path: 'faviList',
          select: 'title createTime content',
          populate: [
            { path: 'author', select: 'avatar userName' },
            { path: 'type', select: 'name' },
            { path: 'district', select: 'name' }
          ]
        })
        .exec()
      this.success(user.faviList)
    }
  }
  async infoList() {
    const userId = this.ctx.params.id
    if (this.ctx.state.user._id !== userId && this.service.role.isAdmin()) {
      this.error('权限不足')
    } else {
      const list = await this.ctx.model['Infos']
        .find({ author: userId })
        .populate([{ path: 'district', select: 'name' },{ path: 'type', select: 'name' }])
        .sort('-createTime')
        .exec()
      this.success(list)
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
    const req = this.ctx.request.body
    this.service.role.requireAdmin()
    if (req.role !== 'fake') {
      this.service.validate.require('phoneNum', 'userName', 'password')
      this.service.validate.minLength(req.password, 6)
      this.service.validate.maxLength(req.password, 16)
    }
    req.email ? this.service.validate.isEmail(req.email) : null
    req.avatar =
      req.avatar ||
      'https://quincy-dev-temp.oss-cn-beijing.aliyuncs.com/qtt/img/userFace.jpg'

    this.service.validate.isMobile(req.phoneNum)
    if (await this.model.findOne({ phoneNum: req.phoneNum })) {
      this.error(`手机号 ${req.phoneNum} 已经注册`)
    } else {
      req.password = this.service.encrypt.signPassword(req.password)
      this.model.create(req)
      this.success(`新账号 ${req.phoneNum} 添加成功`)
    }
  }
  async show() {
    this.service.role.requireAdmin()
    const result = await this.model.findById(this.ctx.params.id)
    if (result) {
      this.success(result)
    } else {
      this.error('资源不存在')
    }
  }
  async update() {
    this.service.role.requireAdmin()
    this.success(
      await this.model.findByIdAndUpdate(
        this.ctx.params.id,
        this.ctx.request.body,
        { new: true }
      )
    )
  }
  async destroy() {
    this.service.role.requireAdmin()
    this.success(await this.model.findByIdAndRemove(this.ctx.params.id))
  }
}
