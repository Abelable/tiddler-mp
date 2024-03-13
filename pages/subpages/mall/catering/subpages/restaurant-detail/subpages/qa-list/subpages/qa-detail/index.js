import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../../../../store/index";
import CateringService from "../../../../../../utils/cateringService";

const cateringService = new CateringService();

Page({
  data: {
    restaurantName: "",
    questionInfo: {},
    answerList: [],
    answerTotal: 0,
    finished: false,
    answerContent: "",
  },

  onLoad({ restaurantName, questionInfo }) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
    });

    questionInfo = JSON.parse(questionInfo);
    this.setData({ restaurantName, questionInfo });
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
      this.page = 0;
    }
    const { list = [], total } =
      (await cateringService.getCateringAnswerList(this.questionId, ++this.page)) ||
      {};
    this.setData({
      answerList: init ? list : [...this.data.answerList, ...list],
    });
    if (init) {
      this.setData({ answerTotal: total });
    }
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  setAnswerContent(e) {
    this.setData({
      answerContent: e.detail.value,
    });
  },

  submitAnswer() {
    if (!this.data.answerContent) {
      wx.showToast({
        title: "请输入您的建议",
        icon: "none",
      });
      return;
    }

    cateringService.addCateringAnswer(
      this.questionId,
      this.data.answerContent,
      () => {
        this.setData({ answerContent: "" });
        this.setAnswerList(true);
      }
    );
  },

  deleteQuestion() {
    wx.showModal({
      content: "确定删除该提问吗？",
      success: (result) => {
        if (result.confirm) {
          cateringService.deleteCateringQuestion(this.questionId, () => {
            wx.navigateBack();
          });
        }
      },
    });
  },

  deleteAnswer(e) {
    wx.showModal({
      content: "确定删除该回答吗？",
      success: (result) => {
        if (result.confirm) {
          cateringService.deleteCateringAnswer(
            this.questionId,
            e.currentTarget.dataset.id,
            () => {
              this.setAnswerList(true);
            }
          );
        }
      },
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
