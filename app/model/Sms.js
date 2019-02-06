module.exports = app => {
  return app.mongoose.model(
    'Sms',
    new app.mongoose.Schema({
      user: { type: String, ref: 'User', index: true },
      phone: { type: String },
      sms: { type: String },
      type: { type: String },
      state: { type: String },
      sendTime: {
        type: Date,
        default: Date.now
      }
    })
  )
}
