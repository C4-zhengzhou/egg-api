const OSS = require('ali-oss')

module.exports = class extends require('egg').Controller {
  constructor(app) {
    super(app)
    this.success = this.ctx.helper.success
    this.error = this.ctx.helper.error
    this.ossClient = new OSS({
      accessKeyId: this.config.aliyun.accessKeyId,
      accessKeySecret: this.config.aliyun.accessKeySecret,
      region: this.config.aliyun.region,
      bucket: this.config.aliyun.bucket
    })
  }
  async image() {
    const stream = await this.ctx.getFileStream()
    const name =
      'c4/image/' + this.service.file.generateFileName(stream.filename)
    let result = await this.ossClient.put(name, stream)
    this.success(result.url)
  }
}
