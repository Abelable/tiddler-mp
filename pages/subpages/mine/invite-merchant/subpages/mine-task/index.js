Page({
  data: {
    curMenuIdx: 0
  },

  onLoad() {},

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
  },

  checkRecord() {
    wx.navigateTo({
      url: "../reward-decord/index"
    });
  }
});
