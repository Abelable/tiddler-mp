import { WEBVIEW_BASE_URL } from "../../../../../../config";
import { store } from "../../../../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false,
    merchantTypeList: [
      { name: "景区服务商", icon: "scenic" },
      { name: "酒店服务商", icon: "hotel" },
      { name: "餐饮商家", icon: "catering" },
      { name: "电商商家", icon: "goods" }
    ],
    merchantType: 1,
    shopType: 1,
    agree: false
  },

  onLoad() {},

  selectMerchantType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ merchantType: index + 1 });
  },

  selectShopType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ shopType: index + 1 });
  },

  toggleAgree() {
    this.setData({
      agree: !this.data.agree
    });
  },

  checkAgreement() {
    const { merchantType } = this.data;
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/protocol/${
        ["scenic_", "hotel_", "catering_", ""][merchantType - 1]
      }merchant`
    });
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
    const originalPath =
      "/pages/subpages/mine/setting/subpages/merchant-settle/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return { title: "商家入驻", path };
  }
});
