module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.successWithPage = this.ctx.helper.successWithPage
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.model = this.ctx.model['Article']
  }
  async index() {
    const req = this.ctx.query
    let query = {}
    if (req.category) query.category = req.category
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
      .find(
        query,
        'title category author like pv isPublish isRecommend createTime updateTime'
      )
      .sort(req.sort || '-createTime')
      .skip(page.size * (page.page - 1))
      .limit(page.size)
      .exec()
    this.successWithPage(this.service.filter.filterData(list), page)
  }
  async create() {
    this.service.auth.requireLogin()
    let req = this.ctx.request.body
    req.author = await this.service.auth.userId()
    this.success(await this.model.create(req))
  }
  async show() {
    let result = await this.model.findById(this.ctx.params.id)
    if (result) {
      this.success(result)
      result.pv++
      result.save()
    } else {
      this.error('资源不存在')
    }
  }
  async update() {
    this.service.auth.requireLogin()
    let payload = this.ctx.request.body
    payload.updateTime = Date.now()
    this.success(
      await this.model.findByIdAndUpdate(this.ctx.params.id, payload, {
        new: true
      })
    )
  }
  async destroy() {
    this.service.auth.requireAdmin()
    this.success(await this.model.findByIdAndRemove(this.ctx.params.id))
  }
}
