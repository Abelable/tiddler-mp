const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    curMenuIdx: 0,
    navBarVisible: false,
    menuFixed: false,
    worksListHeightArr: [400, 400, 400, 400],
    strategyList: [],
    videoList: [],
    liveList: [],
    noteList: [],
  },

  onLoad() {
    this.setNavBarVisibleLimit()
    this.setMenuFixedLimit()
    this.scrollTopArr = [0, 0, 0, 0]
  },

  switchMenu(e) {
    this.setData({
      curMenuIdx: e.currentTarget.dataset.index
    })
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

  setNavBarVisibleLimit() {
    const query = wx.createSelectorQuery()
    query.select('.name').boundingClientRect()
    query.exec(res => {
      this.navBarVisibleLimit = res[0].top
    })
  },

  setMenuFixedLimit() {
    const query = wx.createSelectorQuery()
    query.select('.works-menu').boundingClientRect()
    query.exec(res => {
      this.menuFixedLimit = res[0].top - statusBarHeight - 44
    })
  },

  onReachBottom() {
  },
  
  onPullDownRefresh() {
    wx.stopPullDownRefresh() 
  },

  onPageScroll(e) {
    if (e.scrollTop >= this.navBarVisibleLimit) {
      !this.data.navBarVisible && this.setData({
        navBarVisible: true
      })
    } else {
      this.data.navBarVisible && this.setData({
        navBarVisible: false
      })
    }

    if (e.scrollTop >= this.menuFixedLimit) {
      !this.data.menuFixed && this.setData({
        menuFixed: true
      })
    } else {
      this.data.menuFixed && this.setData({
        menuFixed: false
      })
    }

    this.scrollTop = e.scrollTop
  },
})
