import BaseService from "../../../../../services/baseService";

class MerchantService extends BaseService {
  getShopIncomeOverview(shopId) {
    return this.get({
      url: `${this.baseUrl}/shop/income/data_overview`,
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

  async getShopIncomeOrderList({
    shopId,
    timeType,
    statusList,
    page,
    limit = 10
  }) {
    const { list = [] } = await this.post({
      url: `${this.baseUrl}/shop/income/order_list`,
      data: { shopId, timeType, statusList, page, limit },
      loadingTitle: "加载中..."
    });
    return list;
  }
}

export default MerchantService;
