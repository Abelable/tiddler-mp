import { WEBVIEW_BASE_URL } from '../../../../config'
import BaseService from '../../../../services/baseService'

const baseService = new BaseService()
const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    authModalVisible: false
  },

  async getMobile(e) {
    const mobile = await baseService.getUserMobile(e.detail.code)
    if (mobile) {
      this.mobile = mobile
      this.setData({ authModalVisible: true })
    }
  },

  async chooseAvatar(e) {
    const avatarUrl = (await baseService.uploadFile(e.detail.avatarUrl)) || "";
    this.setData({ avatarUrl });
  },

  setNickname(e) {
    this.nickname = e.detail.value;
  },

  saveAuthInfo() {
    if (!this.nickname) {
      wx.showToast({
        title: "请输入用户昵称",
        icon: "none"
      });
      return;
    }
    this.register();
  },

  async register() {
    const { code } = await baseService.wxLogin();
    const token = await baseService.register(
      code,
      this.data.avatarUrl,
      this.nickname,
      this.mobile
    );
    if (token) {
      wx.setStorageSync("token", token);
      wx.navigateBack();
    }
  },

  serviceAgreement() {
    wx.navigateTo({ url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/agreements/user_service` })
  },

  hideModal() {
    this.setData({ authModalVisible: false })
  },

  navToHome() {
    wx.switchTab({ url: '/pages/tab-bar-pages/home/index' })
  }
})
