const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    navrBarActive: false,
    contentWrapHeightArr: [windowHeight, windowHeight],
    activeMenuIdx: 1,
  },

  switchMenu(e) {
    this.setData({
      activeMenuIdx: Number(e.currentTarget.dataset.index)
    })
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
