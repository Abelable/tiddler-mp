import { WEBVIEW_BASE_URL } from '../../../config'
import RegisterService from '../../../services/registerService'

const { statusBarHeight } = getApp().globalData
const registerService = new RegisterService()

Page({
  data: {
    statusBarHeight,
    showAuthModal: false
  },

  // 获取手机号
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
    this.register(avatarUrl, nickName, gender)
  },

  async register(avatarUrl, nickName, gender) {
    const { code } = await registerService.wxLogin()
    const token = await registerService.register(code, avatarUrl, nickName, gender, this.mobile)
    if (token) {
      wx.setStorageSync('token', token)
      // await initUserData()
      wx.wx.navigateBack()
    }
  },

  // 查看服务协议
  serviceAgreement() {
    wx.navigateTo({ url: `/pages/common/webview/index?url=${WEBVIEW_BASE_URL}/agreements/user_service` })
  },

  // 关闭弹窗
  hideModal() {
    this.setData({ showAuthModal: false })
  },

  back() {
    customBack()
  },

})