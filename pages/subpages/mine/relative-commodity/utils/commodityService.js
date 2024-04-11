import BaseService from "../../../../../services/baseService";

class CommodityService extends BaseService {
  async getGoodsList({ keywords, goodsIds, page, limit = 10 }) {
    return await this.post({
      url: `${this.baseUrl}/goods/media_relative_list`,
      data: { keywords, goodsIds, page, limit },
      loadingTitle: "加载中..."
    });
  }

  async getScenicList({ keywords, scenicIds, page, limit = 10 }) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/mobile`,
      data: { keywords, scenicIds, page, limit },
      loadingTitle: "加载中..."
    });
  }

  async getHotelList({ keywords, hotelIds, page, limit = 10 }) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/mobile`,
      data: { keywords, hotelIds, page, limit },
      loadingTitle: "加载中..."
    });
  }

  async getRestaurantList({ keywords, restaurantIds, page, limit = 10 }) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/mobile`,
      data: { keywords, restaurantIds, page, limit },
      loadingTitle: "加载中..."
    });
  }
}

export default CommodityService;
