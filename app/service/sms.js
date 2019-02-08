const SMS = require('ali-sms')
const accessConfig = {
  accessKeyID: 'accessKeyID',
  accessKeySecret: 'accessKeySecret'
}
module.exports = class extends require('egg').Service {
  async sendSms(phone, param) {
    return new Promise((resolve, reject) => {
      SMS(
        Object.assign(
          {
            paramString: param,
            recNum: [phone],
            signName: '阿里云短信测试专用',
            templateCode: 'SMS_140670069'
          },
          accessConfig
        ),
        (err, body) => {
          if (err) {
            reject(err)
          } else {
            resolve(body)
          }
        }
      )
    })
  }
}
