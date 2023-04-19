import BaseService from "../../../../services/baseService";

class MallService extends BaseService {
  async getMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/list`,
      data: { page, limit },
      loadingTitle: '加载中...'
    });
  }

  async getFollowMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/follow_list`,
      data: { page, limit },
      loadingTitle: '加载中...'
    });
  }
}

export default MallService;
