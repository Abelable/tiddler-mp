import checkLogin from '../../../utils/checkLogin'

Page({
  data: {
    url: ''
  },

  async onLoad(options) {
    let { q, url, token, ...rest } = options

    if (q) {
      const decodeQ = decodeURIComponent(q)
      const index = decodeQ.indexOf('h5=') + 3
      this.webviewUrl = decodeQ.substring(index)
      checkLogin(this.initData)
    } else {
      for (let key in rest) {
        if (rest.hasOwnProperty(key) && rest[key]) url += `${url.indexOf('?') === -1 ? '?' : '&'}${key}=${rest[key]}`
      }
      this.webviewUrl = url
      if (token) {
        this.setData({ 
          url: `${this.webviewUrl}${this.webviewUrl.indexOf('?') === -1 ? '?' : '&'}token=${token}` 
        }) 
      } else checkLogin(this.initData)
    }
  },

  initData() {
    this.setData({
      url: `${this.webviewUrl}${this.webviewUrl.indexOf('?') === -1 ? '?' : '&'}token=${wx.getStorageSync('token')}`
    })
  },

  onShareAppMessage() {
    const path = `/pages/subpages/common/webview/index?url=${this.webviewUrl.replace('?', '&')}`
    return { path }
  }
})
