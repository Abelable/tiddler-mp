Component({
  properties: {
    roomId: String,
    fansName: String,
    isLive: Boolean,
    msgList: {
      type: Array,
      observer(val) {
        if (val.length && this.properties.isLive && !this.data.stopScroll) {
          const query = wx.createSelectorQuery().in(this)
          const promise_wrap = new Promise(resolve => {
            query.select('.comment').boundingClientRect(res => {
              res && resolve(res.height)
            })
          })
          const promise_content = new Promise(resolve => {
            query.select('.msg-lists').boundingClientRect(res => {
              res && resolve(res.height)
            })
          })
          Promise.all([promise_wrap, promise_content]).then(res => {
            this.setData({
              scrollTop: res[1] - res[0]
            })
          })
          query.exec()
        }
      }
    }
  },
  data: {
    scrollTop: 0,
    stopScroll: false
  },
  methods: {
    onTouchStart() {
      clearTimeout(this.stopScrollTimeout)
      !this.data.stopScroll && this.setData({stopScroll: true})
    },
    onTouchEnd() {
      this.stopScrollTimeout = setTimeout(() => {
        this.setData({stopScroll: false})
      }, 2000)
    }
  }
})