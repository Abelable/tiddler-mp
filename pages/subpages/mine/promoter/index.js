import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../config";
import PromoterService from "./utils/promoterService";

const promoterService = new PromoterService();
const { statusBarHeight } = getApp().globalData.systemInfo;
const rightsList = [
  { icon: "reward", name: "分享奖励" },
  { icon: "indirect", name: "间推奖励" },
  { icon: "team", name: "团队奖励" },
  { icon: "mentor", name: "专属导师" },
  { icon: "product", name: "专享产品" },
  { icon: "activity", name: "线下活动" },
  { icon: "trip", name: "文旅体验" },
  { icon: "meeting", name: "代言人大会" }
];

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"]
  },

  data: {
    statusBarHeight,
    rightsList,
    navBarBgVisible: false,
    curLevel: 1,
    achievement: 0,
    commissionSumInfo: null,
    dateList: ["今日", "昨日", "本月", "上月"],
    curDateIdx: 0,
    commissionTimeData: null,
    customerData: null
  },

  observers: {
    userInfo: function (userInfo) {
      if (userInfo) {
        this.setData({
          curLevel: store.userInfo.promoterInfo.level
        });
      }
    }
  },

  methods: {
    onLoad() {
      this.setAchievement();
      this.setCommissionSumInfo();
      this.setCommissionTimeData();
      this.setCustomerData();
    },

    async setAchievement() {
      const achievement = await promoterService.getPromoterAchievement();
      this.setData({ achievement });
    },

    async setCommissionSumInfo() {
      const commissionSumInfo = await promoterService.getCommissionSumInfo();
      this.setData({ commissionSumInfo });
    },

    selectDate(e) {
      const curDateIdx = e.currentTarget.dataset.index;
      this.setData({ curDateIdx });
      this.setCommissionTimeData();
    },

    async setCommissionTimeData() {
      const commissionTimeData = await promoterService.getCommissionTimeData(
        this.data.curDateIdx + 1
      );
      this.setData({ commissionTimeData });
    },

    async setCustomerData() {
      const customerData = await promoterService.getCustomerData();
      this.setData({ customerData });
    },

    swiperChange(e) {
      const curLevel = e.detail.current + 1;
      this.setData({ curLevel });
    },

    onPageScroll(e) {
      if (e.scrollTop >= 10) {
        if (!this.data.navBarBgVisible) {
          this.setData({ navBarBgVisible: true });
        }
      } else {
        if (this.data.navBarBgVisible) {
          this.setData({ navBarBgVisible: false });
        }
      }
    },

    withdraw() {
      wx.navigateTo({
        url: "./subpages/account/index"
      });
    },

    checkAchievementDetail() {
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/promoter/achievement`;
      wx.navigateTo({ url });
    },

    navToCustomer(e) {
      wx.navigateTo({
        url: `./subpages/customer/index?type=${e.currentTarget.dataset.type}`
      });
    }
  }
});
