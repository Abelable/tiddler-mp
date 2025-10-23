import { store } from "../../../../../store/index";
import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curTripIdx: 0,
    starTripList: [],
    mediaList: [],
    loading: false,
    finished: false
  },

  async onLoad() {
    await this.setStarTripList();
    this.setMediaList(true);
  },

  swiperChange(e) {
    const curTripIdx = e.detail.current;
    this.setData({ curTripIdx });
    this.setMediaList(true);
  },

  onReachBottom() {
    this.setMediaList();
  },

  async setStarTripList() {
    const starTripList = await mediaService.getStarTripList();
    this.setData({ starTripList });
  },

  async setMediaList(init = false) {
    const { curTripIdx, starTripList, mediaList } = this.data;
    const { productType, productId } = starTripList[curTripIdx];

    if (init) {
      this.page = 0;
      this.setData({ mediaList: [], finished: false });
    }
    this.setData({ loading: true });
    const { list = [] } =
      (await mediaService.getRelativeMediaList(
        productType,
        productId,
        ++this.page
      )) || {};
    this.setData({
      mediaList: init ? list : [...mediaList, ...list],
      loading: false
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  checkTrip(e) {
    const { index } = e.currentTarget.dataset;
    const { productType, productId } = this.data.starTripList[index];
    const url =
      productType === 1
        ? `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${productId}`
        : `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${productId}`;
    wx.navigateTo({ url });
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath = "/pages/subpages/home/theme/star-trip/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return { path };
  }
});
