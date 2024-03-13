import CateringService from "../../../../utils/cateringService";

const cateringService = new CateringService();

Page({
  data: {
    qaList: [],
    finished: false,
    questionContent: "",
  },

  onLoad({ restaurantId, restaurantName }) {
    this.restaurantId = restaurantId;
    this.restaurantName = restaurantName;
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
      (await cateringService.getCateringQaList(this.restaurantId, ++this.page)) || {};
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

    cateringService.addCateringQuestion(
      this.restaurantId,
      this.data.questionContent,
      () => {
        this.setData({ questionContent: "" });
        this.setQaList(true);
      }
    );
  },

  checkQaDetail(e) {
    const questionInfo = JSON.stringify(e.currentTarget.dataset.info);
    const url = `./subpages/qa-detail/index?restaurantName=${this.restaurantName}&questionInfo=${questionInfo}`;
    wx.navigateTo({ url });
  },
});
