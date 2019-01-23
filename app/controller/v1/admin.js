module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.successWithPage = this.ctx.helper.successWithPage
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.model = this.ctx.model['Admins']
  }
  async index() {
    this.service.role.requireAdmin()
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
