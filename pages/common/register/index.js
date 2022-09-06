import { WEBVIEW_BASE_URL } from '../../../config'
const { statusBarHeight } = getApp().globalData


Page({
  data: {
    statusBarHeight,
    showAuthModal: false
  },

  async onLoad() {
    // const { code } = await loginService.wxLogin()
    // this.code = code
  },

  // 获取手机号
  async getPhoneNumber(e) {
    // const { encryptedData, iv } = e.detail
    // const { openid, session_key, unionid } = await loginService.getSessionKey(this.code) || {}
    // const { phoneNumber } = await loginService.getPhone(session_key, iv, encryptedData) || {}
    // wx.setStorage({ key: "phone", data: phoneNumber })
    // wx.setStorage({ key: "openid", data: openid })
    // this.phoneNumber = phoneNumber
    // this.unionid = unionid
    // this.openid = openid
    // this.setData({ showAuthModal: true })
  },

  async getUserProfile() {
    // const { userInfo } = await loginService.getUserProfile()
    // const { avatarUrl, nickName, gender } = userInfo
    // const { token, shop_id } = await loginService.login(this.phoneNumber, nickName, avatarUrl, gender, this.openid, this.unionid)
    // wx.setStorageSync('token', token)
    // wx.setStorage({ key: 'myShopid', data: shop_id || '' })
    // await initUserData()
    // customBack(true)
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