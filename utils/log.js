import dayjs from 'dayjs'

class Log {
  static error(log) {
    const logs = wx.getStorageSync('errLogs')
    const logList = logs ? JSON.parse(logs) : []
    logList.push({
      ...log,
      page: getCurrentPages()[getCurrentPages().length - 1].route,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    wx.setStorage({ key: 'errLogs', data: JSON.stringify(logList) })
  }
}

export default Log