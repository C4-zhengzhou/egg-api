const crypto = require('crypto')
module.exports = class extends require('egg').Service {
  signPassword(val) {
    return crypto
      .pbkdf2Sync(val, this.config.passwordSalt, 1000, 32, 'sha512')
      .toString('base64')
  }
  signJwt(user) {
    return this.app.jwt.sign(
      {
        _id: user._id,
        nickName: user.nickName,
        role: user.role
      },
      this.config.jwt.secret,
      { expiresIn: this.config.jwt.expiresIn }
    )
  }
  isTokenExp() {
    if (!this.ctx.state.user.exp) {
      return true
    } else if (this.ctx.state.user.exp < Date.now()) {
      return true
    } else {
      return false
    }
  }
}
