import MerchantService from "../../../utils/merchantService";

class IncomeService extends MerchantService {
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
