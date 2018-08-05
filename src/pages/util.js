export default {
  formatDate: function (date, format) { // 格式化日期
    var d = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S+': date.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '')
        .substr(4 - RegExp.$1.length))
    }
    for (let k in d) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? d[k]
          : ('00' + d[k]).substr(('' + d[k]).length))
      }
    }
    return format
  },
  getCookRank (rank) {
    switch (rank) {
      case 'SUPER':
        return '特级厨师'
      case 'ONE':
        return '一级厨师'
      case 'TWO':
        return '二级厨师'
      case 'THREE':
        return '三级厨师'
      case 'FOUR':
        return '四级厨师'
    }
  },
  // 查找指定ID的行政区
  getAddressById (addressId, addrData) {
    for (let i = 0; i < addrData.length; i++) {
      if (addrData[i].value === addressId) {
        return addrData[i]
      }
    }
    return null
  },

  // 计算两个日期的时间间隔
  daySpan (start, end) {
    if (start === null || start.length === 0 || end === null || end.length === 0) {
      return 0
    }

    let arr = start.split('-')
    let starttime = new Date(arr[0], parseInt(arr[1] - 1), arr[2])
    let starttimes = starttime.getTime()

    let arrs = end.split('-')
    let endtime = new Date(arrs[0], parseInt(arrs[1] - 1), arrs[2])
    let endtimes = endtime.getTime()

    let intervalTime = endtimes - starttimes // 两个日期相差的毫秒数 一天86400000毫秒
    let interDays = ((intervalTime).toFixed(2) / 86400000)

    return interDays
  },

  containsUser (users, user) {
    for (let i in users) {
      if (users[i].id === user.id) {
        return true
      }
      return false
    }
  }
}
