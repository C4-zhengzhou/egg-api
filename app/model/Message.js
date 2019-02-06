const shortid = require('shortid')

module.exports = app => {
  return app.mongoose.model(
    'Message',
    new app.mongoose.Schema(
      {
        // 发送人，关联用户表
        fromUser: { type: String, ref: 'User' },
        // 接收人，关联用户表
        toUser: { type: String, ref: 'User' },
        // 消息标题
        title: { type: String },
        // 消息内容
        content: { type: String },
        type: { type: String },
        state: { type: String },
        // 创建时间
        createTime: { type: Date, default: Date.now }
      },
      { versionKey: false }
    )
  )
}
