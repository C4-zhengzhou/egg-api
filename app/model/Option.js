const shortid = require('shortid')

module.exports = app => {
  return app.mongoose.model(
    'Option',
    new app.mongoose.Schema(
      {
        // 自定义ID
        _id: { type: String },
        // 配置项名称
        name: { type: String, unique: true, required: true },
        // 配置项值
        value: { type: Schema.Types.Mixed, required: true },
        // 描述信息
        description: { type: String },
        // 是否可用
        available: { type: Boolean, default: true }
      },
      { versionKey: false }
    )
  )
}
