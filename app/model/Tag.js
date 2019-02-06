module.exports = app => {
  return app.mongoose.model(
    'Tag',
    new app.mongoose.Schema(
      {
        _id: { type: String },
        name: { type: String, required: true, unique: true, trim: true },
        searchable: { type: Boolean, default: true },
        type: { type: String },
        state: { type: String }
      },
      { versionKey: false }
    )
  )
}
