import BaseService from "../../../../services/baseService";

class HomeService extends BaseService {
  async getTopMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/top_list`,
      data: { page, limit }
    });
  }

  async getMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/list`,
      data: { page, limit }
    });
  }

  async getRandomMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/random_list`,
      data: { page, limit }
    });
  }

  async getFollowMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/follow_list`,
      data: { page, limit }
    });
  }

  async getNearbyProductList(longitude, latitude, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/mall/nearby_product_list`,
      data: { longitude, latitude, page, limit }
    });
  }
}

export default HomeService;
