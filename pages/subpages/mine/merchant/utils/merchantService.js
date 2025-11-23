import BaseService from "../../../../../services/baseService";

class MerchantService extends BaseService {
  getScenicShopIncomeSum(shopId) {
    return this.get({
      url: `${this.baseUrl}/scenic/shop/income/sum`,
      data: { shopId }
    });
  }

  getScenicShopTimeData(shopId, timeType) {
    return this.get({
      url: `${this.baseUrl}/scenic/shop/income/time_data`,
      data: { shopId, timeType }
    });
  }

  getScenicShopOrderTotal(shopId) {
    return this.get({
      url: `${this.baseUrl}/scenic/shop/order/total`,
      data: { shopId }
    });
  }

  getHotelShopIncomeSum(shopId) {
    return this.get({
      url: `${this.baseUrl}/hotel/shop/income/sum`,
      data: { shopId }
    });
  }

  getHotelShopTimeData(shopId, timeType) {
    return this.get({
      url: `${this.baseUrl}/hotel/shop/income/time_data`,
      data: { shopId, timeType }
    });
  }

  getHotelShopOrderTotal(shopId) {
    return this.get({
      url: `${this.baseUrl}/hotel/shop/order/total`,
      data: { shopId }
    });
  }

  getCateringShopIncomeSum(shopId) {
    return this.get({
      url: `${this.baseUrl}/catering/shop/income/sum`,
      data: { shopId }
    });
  }

  getCateringShopTimeData(shopId, timeType) {
    return this.get({
      url: `${this.baseUrl}/catering/shop/income/time_data`,
      data: { shopId, timeType }
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

  getShopOrderTotal(shopId) {
    return this.get({
      url: `${this.baseUrl}/shop/order/total`,
      data: { shopId }
    });
  }

  async refundScenicOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/shop/order/refund`,
      data: { shopId, orderId },
      success
    });
  }

  async approveScenicOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/shop/order/approve`,
      data: { shopId, orderId },
      success
    });
  }

  async approveHotelOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/shop/order/approve`,
      data: { shopId, orderId },
      success
    });
  }

  async refundHotelOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/shop/order/refund`,
      data: { shopId, orderId },
      success
    });
  }

   async refundGoodsOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/shop/order/refund`,
      data: { shopId, orderId },
      success
    });
  }

  async approveMealTicketOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/catering/shop/meal_ticket/order/approve`,
      data: { shopId, orderId },
      success
    });
  }

  async refundMealTicketOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/catering/shop/meal_ticket/order/refund`,
      data: { shopId, orderId },
      success
    });
  }

  async approveSetMealOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/catering/shop/set_meal/order/approve`,
      data: { shopId, orderId },
      success
    });
  }

  async refundSetMealOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/catering/shop/set_meal/order/refund`,
      data: { shopId, orderId },
      success
    });
  }
}

export default MerchantService;
