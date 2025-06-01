const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight
  },

  navigateBack() {
    wx.navigateBack({ delta: 2 });
  },

  checkRecord() {
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/agreements/withdraw_record`
    });
  }
});
