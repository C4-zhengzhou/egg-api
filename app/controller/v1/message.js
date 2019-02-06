module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.model = this.ctx.model['Message']
  }
  async index() {
    const req = this.ctx.query
    let query = {}
    if (req.type) query.type = req.type
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
    let req = this.ctx.request.body
    req.fromUser = this.ctx.state.user._id
    this.success(await this.model.create(req))
  }
  async show() {
    const result = await this.model.findById(this.ctx.params.id)
    if (result) {
      this.success(result)
    } else {
      this.error('资源不存在')
    }
  }
  async update() {
    this.service.auth.requirelogin()
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
