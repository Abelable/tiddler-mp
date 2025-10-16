const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false
  },

  onLoad() {
  },

    onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.headerVisible) {
        this.setData({ headerVisible: true });
      }
    } else {
      if (this.data.headerVisible) {
        this.setData({ headerVisible: false });
      }
    }
  },
});
