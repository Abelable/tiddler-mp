import BaseService from "../../../../services/baseService";

class MallService extends BaseService {
  async getProductList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/mall/product_list`,
      data: { page, limit }
    });
  }
}

export default MallService;
