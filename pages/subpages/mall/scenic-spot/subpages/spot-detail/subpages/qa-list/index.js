import ScenicService from "../../../../utils/scenicService";

const scenicService = new ScenicService();

Page({
  data: {
    qaList: [],
    finished: false,
  },

  onLoad({ scenicId }) {
    this.scenicId = scenicId;
    this.setQaList(true);
  },

  onPullDownRefresh() {
    this.setQaList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setQaList();
  },

  async setQaList(init = false) {
    if (init) {
      this.page = 1;
    }
    const list = await scenicService.getScenicQaList(
      this.scenicId,
      ++this.page
    );
    this.setData({
      qaList: init ? list : [...this.data.qaList, ...list],
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },
});
