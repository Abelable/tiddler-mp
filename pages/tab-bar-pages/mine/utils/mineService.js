import BaseService from "../../../../services/baseService";

class MineService extends BaseService {
  async getUserVideoList(page, limit = 10, id = 0) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video`,
      data: { page, limit, id },
    });
  }

  async getFollowMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/follow_list`,
      data: { page, limit },
    });
  }
}

export default MineService;
