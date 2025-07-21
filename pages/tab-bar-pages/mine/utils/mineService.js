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

  async verifyScenicCode(code, success) {
    return await this.post({
      url: `${this.baseUrl}/scenic/shop/order/verify`,
      data: { code },
      success
    });
  }

  async verifyHotelCode(code, success) {
    return await this.post({
      url: `${this.baseUrl}/hotel/shop/order/verify`,
      data: { code },
      success
    });
  }

  async verifyMealTicketCode(code, success) {
    return await this.post({
      url: `${this.baseUrl}/catering/shop/meal_ticket/order/verify`,
      data: { code },
      success
    });
  }

  async verifySetMealCode(code, success) {
    return await this.post({
      url: `${this.baseUrl}/catering/shop/set_meal/order/verify`,
      data: { code },
      success
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
