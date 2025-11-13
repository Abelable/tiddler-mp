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
    curQuestionId: 0,
    inputPopupVisible: false,
    qrCode: "",
    qrCodeVisible: false
  },

  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["superiorInfo", "userInfo"]
    });

    const { scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.superiorId = decodedSceneList[0] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await promoterService.getUserInfo(this.superiorId);
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });
  },

  onShow() {
    this.setSummary();
    this.setQaList(true);
    this.setEvaluationList(true);
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
  },

  onPullDownRefresh() {
    this.setSummary();
    if (this.data.curMenuIdx) {
      this.setEvaluationList(true);
    } else {
      this.setQaList(true);
    }
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    if (this.data.curMenuIdx) {
      this.setEvaluationList();
    } else {
      this.setQaList();
    }
  },

  async setSummary() {
    const { id } = store.superiorInfo;
    const { tagList, avgScore } = await promoterService.getEvaluationSummary(
      id
    );
    const { answerCount, averageDuration } = await promoterService.getQaSummary(
      id
    );
    this.setData({
      tagList: tagList.slice(0, 6),
      avgScore,
      answerCount,
      averageDuration
    });
  },

  async setQaList(init) {
    if (init) {
      this.qaPage = 0;
    }
    const { qaList } = this.data;
    const { list = [] } =
      (await promoterService.getQaList(store.superiorInfo.id, ++this.qaPage)) ||
      {};
    this.setData({ qaList: init ? list : [...qaList, ...list] });
    if (!list.length) {
      this.setData({ qaFinished: true });
    }
  },

  async setEvaluationList(init) {
    if (init) {
      this.evaluationPage = 0;
    }
    const { evaluationList } = this.data;
    const { list = [] } =
      (await promoterService.getEvaluationList(
        store.superiorInfo.id,
        ++this.evaluationPage
      )) || {};
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
      const { id } = store.superiorInfo;
      const url = `./subpages/evaluation/index?promoterId=${id}`;
      wx.navigateTo({ url });
    } else {
      this.setData({ inputPopupVisible: true });
    }
  },

  answer(e) {
    const { id: curQuestionId } = e.detail;
    this.setData({ curQuestionId, inputPopupVisible: true });
  },

  finishInput() {
    this.setSummary();
    this.setQaList(true);
    this.hideInputPopup();
  },

  hideInputPopup() {
    if (this.data.curMenuIdx) {
      this.setData({ curQuestionId: 0 });
    }
    this.setData({ inputPopupVisible: false });
  },

  async showQrCode() {
    if (!this.data.qrCode) {
      await this.setQrcode();
    }
    this.setData({ qrCodeVisible: true });
  },

  async setQrcode() {
    const scene = `${store.userInfo.id}`;
    const page = "pages/subpages/common/promoter/index";
    const qrCode = await promoterService.getQrCode(scene, page);
    this.setData({ qrCode });
  },

  hideQrCode() {
    this.setData({ qrCodeVisible: false });
  },

  hidePopup() {
    if (this.data.inputPopupVisible) {
      this.hideInputPopup();
    }
    if (this.data.qrCodeVisible) {
      this.hideQrCode();
    }
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
