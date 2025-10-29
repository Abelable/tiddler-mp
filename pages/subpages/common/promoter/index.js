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
      fields: ["superiorInfo"]
    });
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
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
    return { path };
  }
});
