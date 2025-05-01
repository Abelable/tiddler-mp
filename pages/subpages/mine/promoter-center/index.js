import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import PromoterService from "./utils/promoterService";

const promoterService = new PromoterService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    achievementInfo: {},
    dateList: ["今日", "昨日", "本月", "上月"],
    curDateIdx: 0,
    commissionTimeData: null
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo", "promoterInfo"]
    });
  },

  upgrade() {},

  withdraw() {
    wx.navigateTo({
      url: "./subpages/account/index"
    });
  },

  navToCustomer(e) {
    wx.navigateTo({
      url: `./subpages/customer/index?type=${e.currentTarget.dataset.type}`
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
