const shortid = require('shortid')

module.exports = app => {
  return app.mongoose.model(
    'User',
    new app.mongoose.Schema({
      _id: { type: String, default: shortid.generate },
      // 账号名
      account: { type: String, trim: true },
      // 手机号
      phone: { type: String, trim: true },
      // 邮箱
      email: { type: String, trim: true },
      // 微信openid
      wxid: { type: String, trim: true },
      // 密码
      password: { type: String, required: true, trim: true },
      // 昵称
      nickName: { type: String, trim: true },
      // 真实姓名
      trueName: { type: String, trim: true },
      // 性别
      gender: { type: String, trim: true },
      // 所在省份
      province: { type: String, trim: true },
      // 所在城市
      city: { type: String, trim: true },
      // 详细地址
      address: { type: String, trim: true },
      // 头像
      avatar: {
        type: String,
        default:
          'https://quincy-dev-temp.oss-cn-beijing.aliyuncs.com/qtt/img/userFace.jpg',
        trim: true
      },
      // 所属角色
      role: { type: String, trim: true },
      // 当前token
      token: { type: String, trim: true },
      state: { type: String, trim: true },
      available: { type: Boolean, default: true },
      // 推荐人，关联用户ID
      recUser: { type: String, ref: 'User' },
      // 最后登录时间
      lastLoginTime: { type: Date },
      // 最后更新时间
      updateTime: { type: Date },
      // 注册时间
      createdTime: { type: Date, default: Date.now }
    })
  )
}
