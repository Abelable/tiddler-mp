import BaseService from "../../../../services/baseService";

class MallService extends BaseService {
  async getCommodityList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/mall/commodity_list`,
      data: { page, limit },
      loadingTitle: '加载中...'
    });
  }
}

export default MallService;
