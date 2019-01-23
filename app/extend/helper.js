const moment = require('moment')

module.exports = {
  formatTime(time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  },
  formatDate(date) {},
  error(msg, code) {
    this.ctx.body = {
      err: code || 1,
      msg
    }
    this.ctx.status = 200
  },
  success(data) {
    this.ctx.body = {
      err: 0,
      data: data
    }
    this.ctx.status = 200
  },
  successWithPage(list, page) {
    this.ctx.body = {
      err: 0,
      page: page,
      list: list
    }
    this.ctx.status = 200
  }
}
