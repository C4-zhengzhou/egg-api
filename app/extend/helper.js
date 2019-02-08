const moment = require('moment')

module.exports = {
  formatFullTime(time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  },
  formatTime(time) {
    return moment(time).format('HH:mm:ss')
  },
  formatDate(date) {
    return moment(date).format('YYYY-MM-DD')
  },
  error(msg, code) {
    this.ctx.throw(code || 1, msg)
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
