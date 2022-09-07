import Base from './base/index'

class BaseService extends Base {
  async login() {
    const { code } = await this.wxLogin()
    const token = await this.post({ url: `${this.baseUrl}/auth/wx_mp/login`, data: { code } })
    if (token) {
      wx.setStorageSync('token', token)
    }
  }

  async getUserInfo() {
    return await this.get({ url: `${this.baseUrl}/auth/user_info` })
  }
}

export default BaseService
