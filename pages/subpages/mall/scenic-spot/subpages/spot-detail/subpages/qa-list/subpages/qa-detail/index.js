import ScenicService from "../../../../../../utils/scenicService";

const scenicService = new ScenicService();

Page({
  data: {
    scenicName: "",
    questionInfo: {},
    answerList: [],
    finished: false,
  },

  onLoad({ scenicName, questionInfo }) {
    this.setData({ scenicName, questionInfo })
    this.questionId = questionInfo.indexOf;
    this.setAnswerList(true);
  },

  onPullDownRefresh() {
    this.setAnswerList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setAnswerList();
  },

  async setAnswerList(init = false) {
    if (init) {
      this.page = 1;
    }
    const list = await scenicService.getScenicAnswerList(
      this.questionId,
      ++this.page
    );
    this.setData({
      answerList: init ? list : [...this.data.answerList, ...list],
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },
});
