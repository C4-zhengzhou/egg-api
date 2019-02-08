const crypto = require('crypto')
module.exports = class extends require('egg').Service {
  signPassword(val) {
    return crypto
      .pbkdf2Sync(val, this.config.passwordSalt, 1000, 32, 'sha512')
      .toString('base64')
  }
  signAdminJwt(admin) {
    return this.app.jwt.sign(
      {
        adminId: admin._id,
        nickName: admin.nickName,
        role: admin.role
      },
      this.config.jwt.secret,
      { expiresIn: this.config.jwt.expiresIn }
    )
  }
  signUserJwt(user) {
    return this.app.jwt.sign(
      {
        userId: user._id,
        nickName: user.nickName,
        role: user.role
      },
      this.config.jwt.secret,
      { expiresIn: this.config.jwt.expiresIn }
    )
  }
  refreshJwt() {
    if (this.service.auth.isAdmin()) {
      return this.service.encrypt.signAdminJwt(this.ctx.state.user)
    } else {
      return this.service.encrypt.signUserJwt(this.ctx.state.user)
    }
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
