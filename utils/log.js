import dayjs from "dayjs";

class Log {
  static error(log) {
    const logs = wx.getStorageSync("errLogs");
    const logList = logs ? JSON.parse(logs) : [];
    const curPages = getCurrentPages();
    const { route: page } = curPages[curPages.length - 1];
    logList.unshift({
      ...log,
      page,
      time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
    wx.setStorage({ key: "errLogs", data: JSON.stringify(logList) });
  }
}

export default Log;
