const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    follow: false
  },

  onLoad() {},

  follow() {
    this.setData({
      follow: true
    })
  },

  navBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  navToUserCenter() {
    wx.navigateTo({
      url: '/pages/common/user-center/index'
    })
  }
})
