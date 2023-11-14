import { cleanObject } from "../../../../utils/index";
import BaseService from "../../../../services/baseService";

class MallService extends BaseService {
  async searchScenicList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/scenic/search`,
      data: { keywords, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async searchHotelList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/hotel/search`,
      data: { keywords, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async searchHotelList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/search`,
      data: { keywords, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async seachGoodsList({ keywords, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } = await this.get({ 
      url: `${this.baseUrl}/goods/search`, 
      data: cleanObject({ keywords, categoryId, sort, order, page, limit }) ,
      loadingTitle: '加载中...'
    }) || {}
    return list
  }
}

export default MallService;
