module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.model = this.ctx.model['Tag']
  }
  async index() {
    const query = this.ctx.query
    const list = await this.model.find(query).exec()
    this.success(this.service.filter.filterData(list))
  }
  async create() {
    this.service.role.requireAdmin()
    const req = this.ctx.request.body
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
