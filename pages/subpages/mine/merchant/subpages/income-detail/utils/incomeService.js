import MerchantService from "../../../utils/merchantService";

class IncomeService extends MerchantService {
  async getScenicShopIncomeOrderList({
    shopId,
    timeType,
    statusList,
    page,
    limit = 10
  }) {
    const { list = [] } = await this.post({
      url: `${this.baseUrl}/scenic/shop/income/order_list`,
      data: { shopId, timeType, statusList, page, limit },
      loadingTitle: "加载中..."
    });
    return list;
  }

  async getHotelShopIncomeOrderList({
    shopId,
    timeType,
    statusList,
    page,
    limit = 10
  }) {
    const { list = [] } = await this.post({
      url: `${this.baseUrl}/hotel/shop/income/order_list`,
      data: { shopId, timeType, statusList, page, limit },
      loadingTitle: "加载中..."
    });
    return list;
  }

  async getCateringShopIncomeOrderList({
    shopId,
    timeType,
    statusList,
    page,
    limit = 10
  }) {
    const { list = [] } = await this.post({
      url: `${this.baseUrl}/catering/shop/income/order_list`,
      data: { shopId, timeType, statusList, page, limit },
      loadingTitle: "加载中..."
    });
    return list;
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

export default IncomeService;
