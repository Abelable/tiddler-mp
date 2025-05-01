import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../config";
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

  upgrade() {
    const { achievementInfo, userInfo } = this.data;
    const scene =
      achievementInfo.percent === 100 && !userInfo.enterpriseInfoId
        ? "certification"
        : "performance";
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/promoter/${scene}`;
    wx.navigateTo({ url });
  },

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
