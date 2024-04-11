import CateringService from "../../../../utils/cateringService";

const cateringService = new CateringService();

Page({
  data: {
    evaluationList: [],
    finished: false
  },

  onLoad({ restaurantId }) {
    this.restaurantId = restaurantId;
    this.setEvaluationList(true);
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
      this.setData({ finished: false });
    }
    const { list = [] } =
      (await cateringService.getEvaluationList(
        this.restaurantId,
        ++this.page
      )) || {};
    this.setData({
      evaluationList: init ? list : [...this.data.evaluationList, ...list]
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  }
});
