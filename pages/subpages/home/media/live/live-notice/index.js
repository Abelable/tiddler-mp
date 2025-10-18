import LiveService from '../utils/liveService'

const liveService = new LiveService()
const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    roomInfo: null,
    countdown: 0,
  },

  onLoad() {
    this.setRoomInfo()
  },

  async setRoomInfo() {
    const roomInfo = await liveService.getNoticeRoomInfo()
    if (roomInfo) {
      this.setData({ roomInfo })
      this.setCountdown(new Date(roomInfo.noticeTime).getTime())
    }
  },

  setCountdown(startTime) {
    const currentTime = (new Date()).getTime()
    let countdown = (startTime - currentTime) / 1000
    this.setData({ countdown })
    this.countdownInterval = setInterval(() => {
      if (countdown > 0) {
        --countdown
        this.setData({ countdown })
      } else clearInterval(this.countdownInterval)
    }, 1000)
  },

  deleteLiveNotice() {
    wx.showModal({
      content: '确定删除直播预告吗？',
      success: (result) => {
        if(result.confirm){
          liveService.deleteNoticeRoom(() => {
            wx.showToast({
              title: '删除成功',
              icon: 'none',
            })
            setTimeout(() => {
              this.navBack()
            }, 2000)
          })
        }
      }
    })
  },

  navBack() {
    wx.switchTab({
      url: '/pages/tab-bar-pages/mine/index'
    })
  },

  onUnload() {
    clearInterval(this.countdownInterval)
  }
})
