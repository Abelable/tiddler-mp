import MerchantService from "../../../utils/merchantService";

class ShopService extends MerchantService {
  getShopIncomeOverview(shopId) {
    return this.get({
      url: `${this.baseUrl}/shop/income/data_overview`,
      data: { shopId }
    });
  }

  getShopOrderTotal(shopId) {
    return this.get({
      url: `${this.baseUrl}/shop/order/total`,
      data: { shopId }
    });
  }
}

export default ShopService;
