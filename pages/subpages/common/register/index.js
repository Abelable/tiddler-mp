import { WEBVIEW_BASE_URL } from "../../../../config";
import tim from "../../../../utils/tim/index";
import BaseService from "../../../../services/baseService";

const baseService = new BaseService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    agree: false
  },

  onLoad() {
    this.superiorId = wx.getStorageSync("superiorId") || "";
  },

  async getMobile(e) {
    const mobile = await baseService.getUserMobile(e.detail.code);
    if (mobile) {
      this.mobile = mobile;
      this.register();
    }
  },

  async register() {
    const { code } = await baseService.wxLogin();
    const token = await baseService.register(
      code,
      this.mobile,
      this.superiorId
    );
    if (token) {
      wx.setStorageSync("token", token);
      baseService.getUserInfo();
      this.initTim();
      if (this.superiorId) {
        wx.removeStorageSync("superiorId");
      }
      wx.navigateBack();
    }
  },

  async initTim() {
    const { userId, sdkAppId, userSig } = await baseService.getTimLoginInfo();
    tim.init(Number(sdkAppId), String(userId), userSig);
  },

  toast() {
    wx.showToast({
      title: "请先阅读并同意用户服务协议",
      icon: "none"
    });
  },

  toggleAgree() {
    this.setData({
      agree: !this.data.agree
    });
  },

  checkAgreement() {
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/protocol/user`
    });
  },

  navBack() {
    const pagesLength = getCurrentPages().length;
    const prePage = getCurrentPages()[pagesLength - 2];
    const prePageRoute = prePage ? prePage.route : "";
    if (prePageRoute === "pages/subpages/mall/goods/subpages/cart/index") {
      wx.navigateBack({ delta: 2 });
    } else {
      wx.navigateBack();
    }
  }
});
