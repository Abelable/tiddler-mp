import BaseService from "../../../../../services/baseService";
import { cleanObject } from "../../../../../utils/index";

class ProductService extends BaseService {
  async getScenicList({ keywords, scenicIds, page, limit = 10 }) {
    return await this.post({
      url: `${this.baseUrl}/scenic/media_relative_list`,
      data: cleanObject({ keywords, scenicIds, page, limit }),
      loadingTitle: "加载中"
    });
  }

  async getHotelList({ keywords, hotelIds, page, limit = 10 }) {
    return await this.post({
      url: `${this.baseUrl}/hotel/media_relative_list`,
      data: cleanObject({ keywords, hotelIds, page, limit }),
      loadingTitle: "加载中"
    });
  }

  async getRestaurantList({ keywords, restaurantIds, page, limit = 10 }) {
    return await this.post({
      url: `${this.baseUrl}/catering/restaurant/media_relative_list`,
      data: cleanObject({ keywords, restaurantIds, page, limit }),
      loadingTitle: "加载中"
    });
  }

  async getGoodsList({ keywords, goodsIds, page, limit = 10 }) {
    return await this.post({
      url: `${this.baseUrl}/goods/media_relative_list`,
      data: cleanObject({ keywords, goodsIds, page, limit }),
      loadingTitle: "加载中"
    });
  }
}

export default ProductService;
