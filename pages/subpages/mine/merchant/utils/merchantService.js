import BaseService from "../../../../../services/baseService";

class MerchantService extends BaseService {
  getShopOrderTotal(shopId) {
    return this.get({
      url: `${this.baseUrl}/shop/order/total`,
      data: { shopId }
    });
  }

  getShopIncomeSum(shopId) {
    return this.get({
      url: `${this.baseUrl}/shop/income/sum`,
      data: { shopId }
    });
  }

  getShopTimeData(shopId, timeType) {
    return this.get({
      url: `${this.baseUrl}/shop/income/time_data`,
      data: { shopId, timeType }
    });
  }

  getScenicShopOrderTotal(shopId) {
    return this.get({
      url: `${this.baseUrl}/scenic/shop/order/total`,
      data: { shopId }
    });
  }

  async getMealTicketOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/meal_ticket/order/provider_list`,
        data: { status, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async getMealTicketOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
    });
  }

  async getSetMealOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/set_meal/order/provider_list`,
        data: { status, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async getSetMealOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/set_meal/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
    });
  }
}

export default MerchantService;
