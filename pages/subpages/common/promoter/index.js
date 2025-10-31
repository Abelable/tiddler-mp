import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import PromoterService from "./utils/promoterService";

const promoterService = new PromoterService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false,
    curMenuIdx: 0,
    tagList: [],
    avgScore: 0,
    answerCount: 0,
    averageDuration: 0,
    qaList: [],
    qaFinished: false,
    evaluationList: [],
    evaluationFinished: false,
    inputPopupVisible: false
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["superiorInfo", "userInfo"]
    });

    this.setSummary();
    this.setQaList(true);
    this.setEvaluationList(true);
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
  },

  async setSummary() {
    const { id } = store.superiorInfo;
    const { tagList, avgScore } = await promoterService.getEvaluationSummary(
      id
    );
    const { answerCount, averageDuration } = await promoterService.getQaSummary(
      id
    );
    this.setData({ tagList, avgScore, answerCount, averageDuration });
  },

  async setQaList(init) {
    if (init) {
      this.qaPage = 0;
    }
    const { superiorInfo, qaList } = this.data;
    const { list = [] } =
      (await promoterService.getQaList(superiorInfo.id)) || {};
    this.setData({ qaList: init ? list : [...qaList, ...list] });
    if (!list.length) {
      this.setData({ qaFinished: true });
    }
  },

  async setEvaluationList(init) {
    if (init) {
      this.evaluationPage = 0;
    }
    const { superiorInfo, evaluationList } = this.data;
    const { list = [] } =
      (await promoterService.getEvaluationList(superiorInfo.id)) || {};
    this.setData({
      evaluationList: init ? list : [...evaluationList, ...list]
    });
    if (!list.length) {
      this.setData({ evaluationFinished: true });
    }
  },

  contact() {
    const { id, avatar, nickname } = store.superiorInfo;
    const url = `/pages/subpages/notice/chat/index?userId=${id}&name=${nickname}&avatar=${avatar}`;
    wx.navigateTo({ url });
  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: store.superiorInfo.mobile
    });
  },

  interact() {
    if (this.data.curMenuIdx) {
    } else {
      this.setData({ inputPopupVisible: true });
    }
  },

  hideInputPopup() {
    this.setData({ inputPopupVisible: false });
  },

  complain() {
    const { id } = store.superiorInfo;
    const url = `./subpages/complaint/index?promoterId=${id}`;
    wx.navigateTo({ url });
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.headerVisible) {
        this.setData({ headerVisible: true });
      }
    } else {
      if (this.data.headerVisible) {
        this.setData({ headerVisible: false });
      }
    }
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath = "/pages/subpages/common/promoter/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return { path, title: "为您推荐优秀家乡代言人" };
  }
});
