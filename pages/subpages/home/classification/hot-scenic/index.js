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

  checkScenic(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${id}`;
    wx.navigateTo({ url });
  }
});
