import Base from './base/index'

class BaseService extends Base {
  async login(code) {
    return await this.post({ url: `${this.baseUrl}/auth/wx_mp/login`, data: { code } })
  }
}

export default BaseService
