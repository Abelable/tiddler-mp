import BaseService from "../../../../services/baseService";

class MallService extends BaseService {
  async getBannerList() {
    return await this.get({
      url: `${this.baseUrl}/mall/banner_list`
    });
  }

  async getProductList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/mall/product_list`,
      data: { page, limit }
    });
  }
}

export default MallService;
