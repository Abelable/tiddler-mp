import MerchantService from "../../../utils/merchantService";

class SearchService extends MerchantService {
  async getOrderHistoryKeywords(shopId, productType) {
    return await this.get({
      url: `${this.baseUrl}/shop/order/keyword/list`,
      data: { shopId, productType },
      loadingTitle: "正在加载"
    });
  }

  async saveOrderKeywords(shopId, productType, keywords) {
    return await this.post({
      url: `${this.baseUrl}/shop/order/keyword/add`,
      data: { shopId, productType, keywords }
    });
  }

  async clearOrderHistoryKeywords(shopId, productType) {
    return await this.post({
      url: `${this.baseUrl}/shop/order/keyword/clear`,
      data: { shopId, productType }
    });
  }

  async searchScenicOrderList(shopId, keywords) {
    return await this.get({
      url: `${this.baseUrl}/scenic/shop/order/search`,
      data: { shopId, keywords },
      loadingTitle: "正在加载"
    });
  }

  async searchHotelOrderList(shopId, keywords) {
    return await this.get({
      url: `${this.baseUrl}/hotel/shop/order/search`,
      data: { shopId, keywords },
      loadingTitle: "正在加载"
    });
  }

  async searchMealTicketOrderList(shopId, keywords) {
    return await this.get({
      url: `${this.baseUrl}/catering/shop/meal_ticket/order/search`,
      data: { shopId, keywords },
      loadingTitle: "正在加载"
    });
  }

  async searchSetMealOrderList(shopId, keywords) {
    return await this.get({
      url: `${this.baseUrl}/catering/shop/set_meal/order/search`,
      data: { shopId, keywords },
      loadingTitle: "正在加载"
    });
  }

  async searchGoodsOrderList(shopId, keywords) {
    return await this.get({
      url: `${this.baseUrl}/shop/order/search`,
      data: { shopId, keywords },
      loadingTitle: "正在加载"
    });
  }
}

export default SearchService;
