import BaseService from './baseService'

class RegisterService extends BaseService {
  async checkIsExpired() {
    return await this.get({ url: `${this.mmsUrl}/api/v4/anchor/isExpired`, loadingTitle: '' })
  }

  async getMsgCenterInfo() {
    return await this.post({ url: `${this.liveUrl}chat/message-center/msg-count`, loadingTitle: '' })
  }
}

export default RegisterService
