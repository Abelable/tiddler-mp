import HotelService from "../../../../utils/hotelService";

const hotelService = new HotelService();

Page({
  data: {
    evaluationList: [],
    finished: false,
  },

  onLoad({ hotelId }) {
    this.hotelId = hotelId;
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
      (await hotelService.getHotelEvaluationList(this.hotelId, ++this.page)) ||
      {};
    this.setData({
      evaluationList: init ? list : [...this.data.evaluationList, ...list],
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },
});
