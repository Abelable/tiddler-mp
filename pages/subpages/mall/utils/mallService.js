import { cleanObject } from "../../../../utils/index";
import BaseService from "../../../../services/baseService";

class MallService extends BaseService {
  async getNearbyScenicList({
    id,
    longitude,
    latitude,
    radius = 10,
    page,
    limit = 10
  }) {
    return await this.get({
      url: `${this.baseUrl}/scenic/nearby_list`,
      data: cleanObject({ id, longitude, latitude, radius, page, limit }),
      loadingTitle: "加载中..."
    });
  }

  async getNearbyHotelList({
    id,
    longitude,
    latitude,
    radius = 10,
    page,
    limit = 10
  }) {
    return await this.get({
      url: `${this.baseUrl}/hotel/nearby_list`,
      data: cleanObject({ id, longitude, latitude, radius, page, limit }),
      loadingTitle: "加载中..."
    });
  }

  async getRelativeMediaList(commodityType, commodityId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/commodity_relative_list`,
      data: { commodityType, commodityId, page, limit },
      loadingTitle: "加载中..."
    });
  }
}

export default MallService;
