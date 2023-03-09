import BaseService from '../../../../../services/baseService'

class LiveService extends BaseService {
  async createLive(title, cover, shareCover, resolution, direction, goodsIds, noticeTime, success) {
    return await this.post({ 
      url: `${this.baseUrl}/media/live/create`, 
      data: { title, cover, shareCover, resolution, direction, goodsIds, noticeTime },
      success
    })
  }

  async getNoticeRoomInfo() {
    return await this.get({
      url: `${this.baseUrl}/media/live/notice_room`, 
      loadingTitle: '加载中...'
    })
  }

  async deleteNoticeRoom(id, success) {
    return await this.post({ 
      url: `${this.baseUrl}/media/live/delete_notice_room`, 
      data: { id },
      success
    })
  }
}

export default LiveService
