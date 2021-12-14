const { statusBarHeight, windowHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    navrBarActive: false,
    contentWrapHeightArr: [windowHeight, windowHeight],
    curMenuIdx: 1,
  },

  onLoad() {
    this.scrollTopArr = [0, 0]
    setTimeout(() => {
      this.setContentWrapHeight()
    }, 1000)
  },

  switchMenu(e) {
    this.handleMenuChange(Number(e.currentTarget.dataset.index))
  },

  swiperChange(e) {
    this.handleMenuChange(Number(e.detail.current))
  },

  handleMenuChange(index) {
    const { curMenuIdx } = this.data
    if (curMenuIdx !== index) {
      this.setData({ curMenuIdx: index })
      this.scrollTopArr[curMenuIdx] = this.scrollTop || 0
      wx.pageScrollTo({ scrollTop: this.scrollTopArr[index] || 0, duration: 0 })
    }
  },

  setContentWrapHeight() {
    const { curMenuIdx } = this.data
    const query = wx.createSelectorQuery()
    query.selectAll('.content-wrap').boundingClientRect()
    query.exec(res => {
      if (res[0][curMenuIdx]) {
        this.setData({ 
          [`contentWrapHeightArr[${curMenuIdx}]`]: res[0][curMenuIdx].height 
        })
      }
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

    this.scrollTop = e.scrollTop
  },

  onReachBottom() {
  },
  
  onPullDownRefresh() {
    wx.stopPullDownRefresh() 
  },

  signIn() {
    wx.navigateTo({
      url: './subpages/sign-in/index'
    })
  },

  search() {
    wx.navigateTo({
      url: './subpages/search/index'
    })
  }
})
