module.exports = app => {
  return app.mongoose.model(
    'ArticleCategory',
    new app.mongoose.Schema(
      {
        // 自定义ID
        _id: { type: String },
        // 显示名称
        name: { type: String },
        // 描述
        description: { type: String },
        // 是否可被搜索
        searchable: { type: Boolean, default: true },
        type: { type: String },
        state: { type: String }
      },
      { versionKey: false }
    )
  )
}
