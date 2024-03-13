import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../../../../store/index";
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
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
    });

    questionInfo = JSON.parse(questionInfo);
    this.setData({ scenicName, questionInfo });
    this.questionId = questionInfo.id;
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
    const { list = [] } =
      (await scenicService.getScenicAnswerList(this.questionId, ++this.page)) ||
      {};
    this.setData({
      answerList: init ? list : [...this.data.answerList, ...list],
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  deleteQuestion() {
    wx.showModal({
      content: "确定删除该提问吗？",
      success: (result) => {
        if (result.confirm) {
          scenicService.deleteScenicQuestion(this.questionId, () => {
            wx.navigateBack();
          });
        }
      },
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
