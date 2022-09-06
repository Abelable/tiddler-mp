import BaseService from './baseService'

class RegisterService extends BaseService {
  async getUserMobile(code) {
    return await this.post({ url: `${this.baseUrl}/auth/wx_mp/user_mobile`, data: { code } })
  }

  async register(code, avatar, nickname, gender, mobile) {
    return await this.post({ url: `${this.baseUrl}/auth/wx_mp/register`, data: { code, avatar, nickname, gender, mobile } })
  }
}

export default RegisterService
