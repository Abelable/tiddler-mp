import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIdx: 0,
    scenicLists: [[], [], []],
    curScenicIdx: 0,
    mediaList: [],
    loading: false,
    finished: false
  },

  async onLoad() {
    this.setScenicList();
    this.setMediaList(true);
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });

    if (!this.data.scenicLists[curMenuIdx].length) {
      this.setScenicList();
    }
  },

  swiperChange(e) {
    const curScenicIdx = e.detail.current;
    this.setData({ curScenicIdx });
  },

  onReachBottom() {
    this.setMediaList();
  },

  async setScenicList() {
    const { curMenuIdx } = this.data;
    const scenicList = await mediaService.getLakeCycleList(curMenuIdx + 1);
    this.setData({ [`scenicLists[${curMenuIdx}]`]: scenicList });
  },

  async setMediaList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ mediaList: [], finished: false });
    }
    this.setData({ loading: true });
    const { list = [] } =
      (await mediaService.getLakeCycleMediaList(++this.page)) || {};
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
