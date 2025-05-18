import ScenicService from "../../../../utils/scenicService";

const scenicService = new ScenicService();

Page({
  data: {
    qaList: [],
    finished: false,
    questionContent: "",
  },

  onLoad({ scenicId, scenicName }) {
    this.scenicId = scenicId;
    this.scenicName = scenicName;
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
      (await scenicService.getScenicQaList(this.scenicId, ++this.page)) || {};
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

    scenicService.addScenicQuestion(
      this.scenicId,
      this.data.questionContent,
      () => {
        this.setData({ questionContent: "" });
        this.setQaList(true);
      }
    );
  },

  checkQaDetail(e) {
    const questionInfo = JSON.stringify(e.currentTarget.dataset.info);
    const url = `./subpages/qa-detail/index?scenicName=${this.scenicName}&questionInfo=${questionInfo}`;
    wx.navigateTo({ url });
  },
});
