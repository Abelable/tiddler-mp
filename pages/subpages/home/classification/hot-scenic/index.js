import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIdx: 0,
    hotScenicList: []
  },

  onLoad() {
    this.setHotScenicList();
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
  },

  async setHotScenicList() {
    const hotScenicList = await mediaService.getHotScenicList();
    this.setData({ hotScenicList });
  },

  onScroll(e) {
    if (e.detail.scrollTop < 296 && this.data.curMenuIdx !== 0) {
      this.setData({ curMenuIdx: 0 });
    } else if (
      e.detail.scrollTop >= 296 &&
      e.detail.scrollTop < 296 * 2 &&
      this.data.curMenuIdx !== 1
    ) {
      this.setData({ curMenuIdx: 1 });
    } else if (
      e.detail.scrollTop >= 296 * 2 &&
      e.detail.scrollTop < 296 * 3 &&
      this.data.curMenuIdx !== 2
    ) {
      this.setData({ curMenuIdx: 2 });
    } else if (
      e.detail.scrollTop >= 296 * 3 &&
      e.detail.scrollTop < 296 * 4 &&
      this.data.curMenuIdx !== 3
    ) {
      this.setData({ curMenuIdx: 3 });
    } else if (
      e.detail.scrollTop >= 296 * 4 &&
      e.detail.scrollTop < 296 * 5 &&
      this.data.curMenuIdx !== 4
    ) {
      this.setData({ curMenuIdx: 4 });
    } else if (
      e.detail.scrollTop >= 296 * 5 &&
      e.detail.scrollTop < 296 * 6 &&
      this.data.curMenuIdx !== 5
    ) {
      this.setData({ curMenuIdx: 5 });
    } else if (
      e.detail.scrollTop >= 296 * 6 &&
      e.detail.scrollTop < 296 * 7 &&
      this.data.curMenuIdx !== 6
    ) {
      this.setData({ curMenuIdx: 6 });
    } else if (
      e.detail.scrollTop >= 296 * 7 &&
      e.detail.scrollTop < 296 * 8 &&
      this.data.curMenuIdx !== 7
    ) {
      this.setData({ curMenuIdx: 7 });
    } else if (
      e.detail.scrollTop >= 296 * 8 &&
      e.detail.scrollTop < 296 * 9 &&
      this.data.curMenuIdx !== 8
    ) {
      this.setData({ curMenuIdx: 8 });
    } else if (e.detail.scrollTop >= 296 * 9 && this.data.curMenuIdx !== 9) {
      this.setData({ curMenuIdx: 9 });
    }
  },

  checkScenic(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${id}`;
    wx.navigateTo({ url });
  }
});
