const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    categoryList: [
      { name: '景点门票', icon: './images/ticket.png' },
      { name: '跟团畅游', icon: './images/bus.png' },
      { name: '酒店民宿', icon: './images/hotel.png' },
      { name: '餐饮美食', icon: './images/foot.png' },
      { name: '特色商品', icon: './images/cart.png' },
    ],
    navrBarActive: false,
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

  search() {
    wx.navigateTo({
      url: './subpages/search/index'
    })
  },
  navTo(e) {
    const pageList = [
      './subpages/ticket/index',
      './subpages/tour/index',
      './subpages/hotel/index',
      './subpages/foot/index',
      './subpages/goods/index'
    ]
    wx.navigateTo({
      url: pageList[Number(e.currentTarget.dataset.index)]
    })
  }
})
