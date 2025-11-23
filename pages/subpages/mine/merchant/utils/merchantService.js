import BaseService from "../../../../../services/baseService";

class MerchantService extends BaseService {
  async getScenicShopIncomeSum(shopId) {
    return await this.get({
      url: `${this.baseUrl}/scenic/shop/income/sum`,
      data: { shopId }
    });
  }

  async getScenicShopTimeData(shopId, timeType) {
    return await this.get({
      url: `${this.baseUrl}/scenic/shop/income/time_data`,
      data: { shopId, timeType }
    });
  }

  async getScenicShopOrderTotal(shopId) {
    return await this.get({
      url: `${this.baseUrl}/scenic/shop/order/total`,
      data: { shopId }
    });
  }

  async getHotelShopIncomeSum(shopId) {
    return await this.get({
      url: `${this.baseUrl}/hotel/shop/income/sum`,
      data: { shopId }
    });
  }

  async getHotelShopTimeData(shopId, timeType) {
    return await this.get({
      url: `${this.baseUrl}/hotel/shop/income/time_data`,
      data: { shopId, timeType }
    });
  }

  async getHotelShopOrderTotal(shopId) {
    return await this.get({
      url: `${this.baseUrl}/hotel/shop/order/total`,
      data: { shopId }
    });
  }

  async getCateringShopIncomeSum(shopId) {
    return await this.get({
      url: `${this.baseUrl}/catering/shop/income/sum`,
      data: { shopId }
    });
  }

  async getCateringShopTimeData(shopId, timeType) {
    return await this.get({
      url: `${this.baseUrl}/catering/shop/income/time_data`,
      data: { shopId, timeType }
    });
  }

  async getShopMealTicketOrderTotal(shopId) {
    return await this.get({
      url: `${this.baseUrl}/catering/shop/meal_ticket/order/total`,
      data: { shopId }
    });
  }

  async getShopSetMealOrderTotal(shopId) {
    return await this.get({
      url: `${this.baseUrl}/catering/shop/set_meal/order/total`,
      data: { shopId }
    });
  }

  async getShopIncomeSum(shopId) {
    return await this.get({
      url: `${this.baseUrl}/shop/income/sum`,
      data: { shopId }
    });
  }

  async getShopTimeData(shopId, timeType) {
    return await this.get({
      url: `${this.baseUrl}/shop/income/time_data`,
      data: { shopId, timeType }
    });
  }

  async getShopOrderTotal(shopId) {
    return await this.get({
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
