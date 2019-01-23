module.exports = class extends require('egg').Service {
  filterData(data, keywords) {
    if (data instanceof Array) {
      return this.service.filter.filterArray(data, keywords)
    } else if (data instanceof Object) {
      return this.service.filter.filterObject(data, keywords)
    }
    return data
  }
  filterArray(data, keywords) {
    return data.map(o => {
      return this.service.filter.filterObject(o, keywords)
    })
  }
  filterObject(data, keywords) {
    data.__v || data.__v === 0 ? (data.__v = undefined) : null
    data.password ? (data.password = undefined) : null
    keywords
      ? keywords.forEach(o => {
          data[o] ? (data[o] = undefined) : null
        })
      : null
    return data
  }
  permitData(data, keywords) {
    if (data instanceof Array) {
      return this.service.filter.permitArray(data, keywords)
    } else if (data instanceof Object) {
      return this.service.filter.permitObject(data, keywords)
    }
    return data
  }
  permitArray(data, keywords) {
    return data.map(o => {
      return this.service.filter.permitObject(o, keywords)
    })
  }
  permitObject(data, keywords) {
    const newData = {}
    keywords
      ? keywords.forEach(o => {
          newData[o] = data[o]
        })
      : null
    return newData
  }
}
