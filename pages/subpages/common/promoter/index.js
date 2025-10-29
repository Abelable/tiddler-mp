import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false,
    curMenuIdx: 0,
    score: 0,
    answerNum: 0,
    durantion: 0
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["superiorInfo", "userInfo"]
    });
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
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
