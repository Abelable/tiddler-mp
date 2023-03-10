import BaseService from "../../../../../services/baseService";

class LiveService extends BaseService {
  async createLive(roomInfo, success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/create`,
      data: roomInfo,
      success,
    });
  }

  async getNoticeRoomInfo() {
    return await this.get({
      url: `${this.baseUrl}/media/live/notice_room`,
      loadingTitle: "加载中...",
    });
  }

  async deleteNoticeRoom(success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/delete_notice_room`,
      success,
    });
  }

  async getPushRoomInfo() {
    return await this.get({
      url: `${this.baseUrl}/media/live/push_room`,
      loadingTitle: "加载中...",
    });
  }

  async startLive() {
    return await this.post({
      url: `${this.baseUrl}/media/live/start`,
    });
  }

  async stopLive(success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/stop`,
      success
    });
  }

  async savePraiseCount(id, count) {
    return await this.post({
      url: `${this.baseUrl}/media/live/praise`,
      data: { id, count }
    });
  }
}

export default LiveService;
