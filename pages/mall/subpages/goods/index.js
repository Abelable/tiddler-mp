const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    activeTabIdx: 0,
    tabScroll: 0,
  },

  onLoad() {},

  selectCate(e) {
    const { idx } = e.currentTarget.dataset
    this.setData({ 
      activeTabIdx: idx, 
      tabScroll: (idx - 2) * 80
    })
  },

  navBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})
