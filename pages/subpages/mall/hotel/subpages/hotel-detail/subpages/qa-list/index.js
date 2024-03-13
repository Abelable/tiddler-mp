import HotelService from "../../../../utils/hotelService";

const hotelService = new HotelService();

Page({
  data: {
    qaList: [],
    finished: false,
    questionContent: "",
  },

  onLoad({ hotelId, hotelName }) {
    this.hotelId = hotelId;
    this.hotelName = hotelName;
  },

  onShow() {
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
      this.page = 0;
    }
    const { list = [] } =
      (await hotelService.getHotelQaList(this.hotelId, ++this.page)) || {};
    this.setData({
      qaList: init ? list : [...this.data.qaList, ...list],
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  setQuestionContent(e) {
    this.setData({
      questionContent: e.detail.value,
    });
  },

  submitQuestion() {
    if (!this.data.questionContent) {
      wx.showToast({
        title: "请输入您需要咨询的问题",
        icon: "none",
      });
      return;
    }

    hotelService.addHotelQuestion(
      this.hotelId,
      this.data.questionContent,
      () => {
        this.setData({ questionContent: "" });
        this.setQaList(true);
      }
    );
  },

  checkQaDetail(e) {
    const questionInfo = JSON.stringify(e.currentTarget.dataset.info);
    const url = `./subpages/qa-detail/index?hotelName=${this.hotelName}&questionInfo=${questionInfo}`;
    wx.navigateTo({ url });
  },
});
