import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIdx: 0,
    hotScenicList: [],
    scrollTop: 0
  },

  onLoad() {
    this.setHotScenicList();
  },

  selectMenu(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ curMenuIdx: index, scrollTop: 296 * index });
  },

  async setHotScenicList() {
    const hotScenicList = await mediaService.getHotScenicList();
    this.setData({ hotScenicList });
  },

  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const itemHeight = 296;
    const index = Math.max(0, Math.floor(scrollTop / itemHeight));

    if (this.data.curMenuIdx !== index) {
      this.setData({ curMenuIdx: index });
    }
  },

  checkScenic(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${id}`;
    wx.navigateTo({ url });
  }
});
