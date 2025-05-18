import ScenicService from "../../../../utils/scenicService";

const scenicService = new ScenicService();

Page({
  data: {
    evaluationList: [],
    finished: false,
  },

  onLoad({ scenicId }) {
    this.scenicId = scenicId;
    this.setEvaluationList(true)
  },

  onPullDownRefresh() {
    this.setEvaluationList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setEvaluationList();
  },

  async setEvaluationList(init = false) {
    if (init) {
      this.page = 0;
    }
    const { list = [] } =
      (await scenicService.getScenicEvaluationList(this.scenicId, ++this.page)) ||
      {};
    this.setData({
      evaluationList: init ? list : [...this.data.evaluationList, ...list],
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },
});
