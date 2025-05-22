import BaseService from "../../../../services/baseService";

class HomeService extends BaseService {
  async getMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/list`,
      data: { page, limit }
    });
  }

  async getFollowMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/follow_list`,
      data: { page, limit }
    });
  }
}

export default HomeService;
