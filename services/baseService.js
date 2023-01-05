import Base from './base/index'

class BaseService extends Base {
  async login() {
    const { code } = await this.wxLogin()
    const token = await this.post({ url: `${this.baseUrl}/auth/wx_mp/login`, data: { code } })
    wx.setStorageSync('token', token || '')
  }

  async refreshToken() {
    const token = await this.get({ url: `${this.baseUrl}/auth/token_refresh` })
    if (token) {
      wx.setStorageSync('token', token)
    }
  }

  async getUserInfo() {
    return await this.get({ url: `${this.baseUrl}/user_info`, loadingTitle: '加载中...' })
  }

  async payMerchantOrder() {
    return await this.post({ url: `${this.baseUrl}/shop/merchant/pay_deposit`, data: { orderId: 1 }})
  }
}

export default BaseService
