import { checkLogin } from '../../../../utils/index'

Page({
  data: {
    
  },

  async onLoad(options) {
    
  },

  onShow() {
    
  },

  onShareAppMessage() {
    const path = `/pages/subpages/subpages/common/webview/index?url=${this.webviewUrl.replace('?', '&')}`
    return { path }
  }
})
