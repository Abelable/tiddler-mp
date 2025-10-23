import { store } from "../../../../../store/index";
import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    centerLakeList: [],
    southeastLakeList: []
  },

  async onLoad() {
    const centerLakeList = await mediaService.getLakeTripList(1);
    const southeastLakeList = await mediaService.getLakeTripList(2);
    this.setData({ centerLakeList, southeastLakeList });
  },

  checkScenic(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${id}`;
    wx.navigateTo({ url });
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath = "/pages/subpages/home/theme/lake-trip/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return { path };
  }
});
