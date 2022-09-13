class Log {
  static error(log) {
    const logs = wx.getStorageSync('errLogs')
    logList = logs ? JSON.parse(logs) : []
    logList.push(log)
    wx.setStorage({ key: 'errLogs', data: JSON.stringify(logList) })
  }
}

export default Log