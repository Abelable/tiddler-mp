import BaseService from '../../../../../services/baseService'

class LiveService extends BaseService {
  async createLive(title, cover, shareCover, direction, goodsIds, noticeTime) {
    await this.post({ 
      url: `${this.baseUrl}/media/live/create`, 
      data: { title, cover, shareCover, direction, goodsIds, noticeTime }
    })
  }
}

export default LiveService
