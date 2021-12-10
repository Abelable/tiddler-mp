const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    navrBarActive: false
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.navrBarActive) {
        this.setData({
          navrBarActive: true
        })
      }
    } else {
      if (this.data.navrBarActive) {
        this.setData({
          navrBarActive: false
        })
      }
    }
  },

  onReachBottom() {
  },
  
  onPullDownRefresh() {
    wx.stopPullDownRefresh() 
  },
})
