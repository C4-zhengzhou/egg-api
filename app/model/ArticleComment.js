const shortid = require('shortid')

module.exports = app => {
  return app.mongoose.model(
    'ArticleComment',
    new app.mongoose.Schema(
      {
        // 评论标题
        title: { type: String },
        // 评论内容
        content: { type: String, required: true },
        // 发布人
        author: { type: String, ref: 'User' },
        // 点赞数量
        like: { type: Number, default: 0 },
        type: { type: String },
        state: { type: String },
        // 创建时间
        createTime: { type: Date, default: Date.now }
      },
      { versionKey: false }
    )
  )
}
