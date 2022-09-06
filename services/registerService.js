import BaseService from './baseService'

class RegisterService extends BaseService {
  async checkIsExpired() {
    return await this.get({ url: `${this.baseUrl}/api/v4/anchor/isExpired`, loadingTitle: '' })
  }

  async getMsgCenterInfo() {
    return await this.post({ url: `${this.baseUrl}chat/message-center/msg-count`, loadingTitle: '' })
  }
}

export default RegisterService
