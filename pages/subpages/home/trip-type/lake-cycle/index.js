import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIdx: 0,
    curScenicIdx: 0,
    centerLakeList: [],
    mediaList: [],
    loading: false,
    finished: false,
  },

  async onLoad() {
    const centerLakeList = await mediaService.getLakeTripList(1);
    this.setData({ centerLakeList });

    this.setMediaList(true);
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
  },

  swiperChange(e) {
    const curScenicIdx = e.detail.current;
    this.setData({ curScenicIdx });
  },

  onReachBottom() {
    this.setMediaList();
  },

  async setMediaList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ mediaList: [], finished: false });
    }
    this.setData({ loading: true });
    const { list = [] } =
      (await mediaService.getRelativeMediaList(
        1,
        1,
        ++this.page
      )) || {};
    this.setData({
      mediaList: init ? list : [...this.data.mediaList, ...list],
      loading: false
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  checkScenic(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${id}`;
    wx.navigateTo({ url });
  }
});
