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
      url: "../withdraw-record/index"
    });
  }
});
