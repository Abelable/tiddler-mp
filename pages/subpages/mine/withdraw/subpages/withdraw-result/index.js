const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight
  },

  onLoad(options) {
    this.scene = Number(options.scene)
  },

  navigateBack() {
    wx.navigateBack({ delta: 2 });
  },

  checkRecord() {
    if (this.scene < 4) {
      wx.navigateTo({
        url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/promoter/withdrawal_record`
      });
    } else {
      switch (this.scene) {
        case 7:
           wx.navigateTo({
            url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/withdrawal_record`
          });
          break;
      }
    }
    
  }
});
