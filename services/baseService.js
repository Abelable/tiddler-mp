import Base from './base/index'

class BaseService extends Base {
  async login(code) {
    return await this.post({ url: `${this.baseUrl}/auth/wx_mp/login`, data: { code } })
  }

  async getUserInfo() {
    return await this.get({ url: `${this.baseUrl}/auth/user_info` })
  }
}

export default BaseService
