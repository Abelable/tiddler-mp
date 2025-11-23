import MerchantService from "../../../utils/merchantService";

class ShopService extends MerchantService {
  async getShopIncomeOverview(shopId) {
    return await this.get({
      url: `${this.baseUrl}/hotel/shop/income/data_overview`,
      data: { shopId }
    });
  }
}

export default ShopService;
