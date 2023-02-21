import { cleanObject } from '../utils/index'
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

  async getAddressList() {
    return await this.get({ url: `${this.baseUrl}/address/list` })
  }

  async getPayParams(orderIds) {
    return await this.post({
      url: `${this.baseUrl}/order/pay_params`,
      data: { orderIds }
    })
  }

  async getOrderList({ shopId, status, page, limit = 10 }) {
    const { list = [] } = await this.get({ 
      url: `${this.baseUrl}/order/list`, 
      data: cleanObject({ status, page, limit, shopId }),
      loadingTitle: '加载中...'
    }) || {}
    return list
  }
}

export default BaseService
