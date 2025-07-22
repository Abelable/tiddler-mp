import { WEBVIEW_BASE_URL } from '../../../../config'
import BaseService from '../../../../services/baseService'

const baseService = new BaseService()
const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    agree: false
  },

  onLoad() {
    this.superiorId = wx.getStorageSync("superiorId") || "";
  },

  async getMobile(e) {
    const mobile = await baseService.getUserMobile(e.detail.code)
    if (mobile) {
      this.mobile = mobile
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
      if (this.superiorId) {
        wx.removeStorageSync("superiorId");
      }
      wx.navigateBack();
    }
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
    wx.navigateTo({ url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/protocol/user` })
  },

  navToHome() {
    wx.switchTab({ url: '/pages/tab-bar-pages/home/index' })
  }
})
