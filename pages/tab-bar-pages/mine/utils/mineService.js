import BaseService from "../../../../services/baseService";

class MineService extends BaseService {
  async getUserCollectMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/collect_list`,
      data: { page, limit }
    });
  }

  async getUserLikeMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/like_list`,
      data: { page, limit }
    });
  }

  async verifyGoodsCode(code, success) {
    return await this.post({
      url: `${this.baseUrl}/shop/order/verify`,
      data: { code },
      success
    });
  }
}

export default MineService;
