module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.successWithPage = this.ctx.helper.successWithPage
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.model = this.ctx.model['Admin']
    this.registerRule = {
      phone: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[0-9]{11}$/
      },
      password: {
        type: 'password',
        compare: 'password2',
        required: true,
        min: 6,
        max: 16
      },
      password2: {
        type: 'string',
        required: true,
        min: 6,
        max: 16
      }
    }
    this.loginRule = {
      phone: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[0-9]{11}$/
      },
      password: {
        type: 'password',
        required: true,
        min: 6,
        max: 16
      }
    }
  }
  async login() {
    const payload = this.ctx.request.body
    this.ctx.validate(this.loginRule)
    let admin = await this.model.findOne({ phone: payload.phone })
    if (!admin) {
      this.error(`手机号为 ${payload.phone} 的管理员账号不存在`)
    } else {
      const password = this.service.encrypt.signPassword(payload.password)
      if (admin.password != password) {
        this.error(`密码验证失败`)
      } else {
        const token = this.service.encrypt.signJwt(admin)
        this.success({
          _id: admin._id,
          phone: admin.phone,
          avatar: admin.avatar,
          nickName: admin.nickName,
          role: admin.role,
          token
        })
        admin.lastLoginTime = Date.now()
        await admin.save()
      }
    }
  }
  async create() {
    const AdminNumber = await this.model.estimatedDocumentCount()
    this.ctx.validate(this.registerRule)
    let payload = this.ctx.request.body
    if (AdminNumber === 0) {
      payload.role = 'superAdmin'
      payload.available = true
      payload.password = this.service.encrypt.signPassword(payload.password)
      await this.service.admin.addAccount(payload)
      this.success(`初始管理员账号 ${payload.phone} 添加成功`)
    } else {
      this.service.auth.requireAdmin()
      if (await this.model.findOne({ phoneNum: payload.phone })) {
        this.error(`手机号 ${payload.phone} 已经注册`)
      } else {
        payload.available = false
        payload.password = this.service.encrypt.signPassword(payload.password)
        await this.service.admin.addAccount(payload)
        this.success(`新账号 ${payload.phone} 添加成功`)
      }
    }
  }
  async index() {
    this.service.auth.requireAdmin()
    const req = this.ctx.query
    let query = {}
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
    this.service.auth.requireAdmin()
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
