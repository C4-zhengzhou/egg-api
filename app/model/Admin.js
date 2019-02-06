const shortid = require('shortid')

module.exports = app => {
  return app.mongoose.model(
    'Admin',
    new app.mongoose.Schema({
      // 手机号
      phone: { type: String, require: true },
      // 邮箱
      email: { type: String },
      // 微信openid
      wxid: { type: String },
      // 密码
      password: { type: String, required: true },
      // 昵称
      nickName: { type: String },
      // 真实姓名
      trueName: { type: String },
      // 性别
      gender: { type: String },
      // 头像
      avatar: {
        type: String,
        default:
          'https://quincy-dev-temp.oss-cn-beijing.aliyuncs.com/qtt/img/userFace.jpg'
      },
      // 所属角色
      role: { type: String },
      // 当前token
      token: { type: String },
      state: { type: String },
      available: { type: Boolean, default: true },
      // 最后登录时间
      lastLoginTime: { type: Date },
      // 密码过期时间
      passwordExpireTime: { type: Date },
      // 最后更新时间
      updateTime: { type: Date },
      // 创建时间
      createdTime: { type: Date, default: Date.now }
    })
  )
}
