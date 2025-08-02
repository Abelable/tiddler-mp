import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIdx: 0,
    curScenicIdx: 0,
    centerLakeList: [],
    southeastLakeList: []
  },

  async onLoad() {
    const centerLakeList = await mediaService.getLakeTripList(1);
    const southeastLakeList = await mediaService.getLakeTripList(2);
    this.setData({ centerLakeList, southeastLakeList });
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
  },

  swiperChange(e) {
    const curScenicIdx = e.detail.current;
    this.setData({ curScenicIdx });
  },

  checkScenic(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${id}`;
    wx.navigateTo({ url });
  }
});
