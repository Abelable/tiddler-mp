class Log {
  static error(log) {
    const logs = wx.getStorageSync('errLogs')
    const logList = logs ? JSON.parse(logs) : []
    logList.push(log)
    wx.setStorage({ key: 'errLogs', data: JSON.stringify(logList) })
  }
}

export default Log