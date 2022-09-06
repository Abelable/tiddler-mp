import { WEBVIEW_BASE_URL } from '../../../config'
import RegisterService from '../../../services/registerService'

const { statusBarHeight } = getApp().globalData
const registerService = new RegisterService()

Page({
  data: {
    statusBarHeight,
    showAuthModal: false
  },

  async getMobile(e) {
    const mobile = await registerService.getUserMobile(e.detail.code)
    if (mobile) {
      wx.setStorage({ key: "mobile", data: mobile })
      this.mobile = mobile
      this.setData({ showAuthModal: true })
    }
  },

  async getUserInfo() {
    const { userInfo } = await registerService.getUserProfile()
    const { avatarUrl, nickName, gender } = userInfo
    this.register(avatarUrl, nickName, gender, this.mobile)
  },

  async register(avatar, nickname, gender, mobile) {
    const { code } = await registerService.wxLogin()
    const token = await registerService.register(code, avatar, nickname, gender, mobile)
    if (token) {
      wx.setStorageSync('token', token)
      wx.navigateBack()
    }
  },

  serviceAgreement() {
    wx.navigateTo({ url: `/pages/common/webview/index?url=${WEBVIEW_BASE_URL}/agreements/user_service` })
  },

  hideModal() {
    this.setData({ showAuthModal: false })
  },
})
