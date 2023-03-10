import { store } from "../../../store/index";
const { statusBarHeight, windowHeight } = getApp().globalData

Component({
  data: {
    statusBarHeight,
    navBarActive: false,
    contentWrapHeightArr: [windowHeight, windowHeight],
    curMenuIndex: 1,
  },

  lifetimes: {
    attached() {
      this.scrollTopArr = [0, 0]
      setTimeout(() => {
        this.setContentWrapHeight()
      }, 1000)
    }
  },

  pageLifetimes: {
    show() {
      store.setTabType("home");
    }
  },

  methods: {
    switchMenu(e) {
      this.handleMenuChange(Number(e.currentTarget.dataset.index))
    },
  
    swiperChange(e) {
      this.handleMenuChange(Number(e.detail.current))
    },
  
    handleMenuChange(index) {
      const { curMenuIndex } = this.data
      if (curMenuIndex !== index) {
        this.setData({ curMenuIndex: index })
        this.scrollTopArr[curMenuIndex] = this.scrollTop || 0
        wx.pageScrollTo({ scrollTop: this.scrollTopArr[index] || 0, duration: 0 })
      }
    },
  
    setContentWrapHeight() {
      const { curMenuIndex } = this.data
      const query = wx.createSelectorQuery()
      query.selectAll('.content-wrap').boundingClientRect()
      query.exec(res => {
        if (res[0][curMenuIndex]) {
          this.setData({ 
            [`contentWrapHeightArr[${curMenuIndex}]`]: res[0][curMenuIndex].height 
          })
        }
      })
    },
  
    onPageScroll(e) {
      if (e.scrollTop >= 10) {
        if (!this.data.navBarActive) {
          this.setData({
            navBarActive: true
          })
        }
      } else {
        if (this.data.navBarActive) {
          this.setData({
            navBarActive: false
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
    },
  
    search() {
      wx.navigateTo({
        url: '/pages/subpages/home/search/index'
      })
    }
  }
})
