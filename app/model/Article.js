const shortid = require('shortid')

module.exports = app => {
  return app.mongoose.model(
    'Article',
    new app.mongoose.Schema({
      _id: { type: String, default: shortid.generate },
      // 标题
      title: { type: String, require: true },
      // 内容
      content: { type: String, require: true },
      // 摘要
      excerpt: { type: String },
      // 题图、缩略图
      thumbImg: { type: String },
      // 附件
      attachments: [{ type: String }],
      // 评论，关联文章评论表
      comments: [{ type: String, ref: 'ArticleComment' }],
      // 文章作者，关联用户表
      author: { type: String, ref: 'User' },
      // 分类，关联文章分类表
      category: { type: String, ref: 'ArticleCategory', index: true },
      // 标签，关联标签表
      tags: [{ type: String, ref: 'Tag' }],
      // 原始链接
      originalLink: { type: String },
      // 是否发布
      isPublish: { type: Boolean, default: false },
      // 是否推荐
      isRecommend: { type: Boolean, default: false },
      // 点赞数量
      like: { type: Number, default: 0 },
      // 浏览数量
      pv: { type: Number, default: 1 },
      type: { type: String },
      state: { type: String },
      // 最后更新时间
      updateTime: { type: Date },
      // 创建时间
      createTime: { type: Date, default: Date.now }
    })
  )
}
