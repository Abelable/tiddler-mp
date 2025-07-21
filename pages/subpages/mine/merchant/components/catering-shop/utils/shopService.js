import MerchantService from "../../../utils/merchantService";

class ShopService extends MerchantService {
  getShopIncomeOverview(shopId) {
    return this.get({
      url: `${this.baseUrl}/catering/shop/income/data_overview`,
      data: { shopId }
    });
  }

  getShopMealTicketOrderTotal(shopId) {
    return this.get({
      url: `${this.baseUrl}/catering/shop/meal_ticket/order/total`,
      data: { shopId }
    });
  }

  getShopSetMealOrderTotal(shopId) {
    return this.get({
      url: `${this.baseUrl}/catering/shop/set_meal/order/total`,
      data: { shopId }
    });
  }
}

export default ShopService;
