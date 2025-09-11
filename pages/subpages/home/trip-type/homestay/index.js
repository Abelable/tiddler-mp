import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    lakeHomestayList: [],
    homestayList: [],
    loading: false,
    finished: false
  },

  async onLoad() {
    await this.setLakeHomestayList();
    this.setHomestayList(true);
  },

  onPullDownRefresh() {
    this.setHomestayList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setHomestayList();
  },

  async setLakeHomestayList() {
    const lakeHomestayList = await mediaService.getLakeHomestayList();
    this.setData({ lakeHomestayList });
    this.lakeHomestayIds = lakeHomestayList.map(item => item.id);
  },

  async setHomestayList(init) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    this.setData({ loading: true });
    const { list = [] } =
      (await mediaService.getHomestayList(this.lakeHomestayIds, ++this.page)) ||
      {};
    this.setData({
      homestayList: init ? list : [...this.data.homestayList, ...list],
      loading: false
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  checkHomestay(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${id}`;
    wx.navigateTo({ url });
  }
});
