import { store } from '../../../../../store/index'
import LiveService from '../utils/liveService'

const liveService = new LiveService()
const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    roomInfo: null,
    countDown: 0,
  },

  onLoad() {
    this.setRoomInfo()
  },

  async setRoomInfo() {
    const roomInfo = await liveService.getNoticeRoomInfo()
    if (roomInfo) {
      this.setData({ roomInfo })
      this.setCountDown(roomInfo.noticeTime)
    }
  },

  setCountDown(startTime) {
    const currentTime = (new Date()).getTime()
    let countDown = (startTime - currentTime) / 1000
    this.setData({ countDown })
    this.countDownInterval = setInterval(() => {
      if (countDown > 0) {
        --countDown
        this.setData({ countDown })
      } else clearInterval(this.countDownInterval)
    }, 1000)
  },

  deleteLive() {
    wx.showModal({
      content: '确定删除直播预告吗？',
      success: (result) => {
        if(result.confirm){
          liveService.deleteLive(this.data.roomInfo.id, () => {
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
      url: '/pages/mine/index'
    })
  },

  onUnload() {
    clearInterval(this.countDownInterval)
  }
})
