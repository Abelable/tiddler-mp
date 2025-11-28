import BaseService from "../../../../../services/baseService";

class OrderService extends BaseService {
  async getScenicOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/scenic/order/list`,
        data: { status, page, limit },
        loadingTitle: "正在加载"
      })) || {};
    return list;
  }

  async searchScenicOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/scenic/order/search`,
      data: { keywords },
      loadingTitle: "正在加载"
    });
  }

  async getScenicVerifyCode(orderId, scenicId) {
    return await this.get({
      url: `${this.baseUrl}/scenic/order/verify_code`,
      data: { orderId, scenicId }
    });
  }

  async confirmScenicOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/order/confirm`,
      data: { id },
      success
    });
  }

  async cancelScenicOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/order/cancel`,
      data: { id },
      success
    });
  }

  async refundScenicOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/order/refund`,
      data: { id },
      success
    });
  }

  async deleteScenicOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/order/delete`,
      data: { id },
      success
    });
  }

  async submitScenicEvaluation(
    orderId,
    ticketId,
    score,
    content,
    imageList,
    success
  ) {
    return await this.post({
      url: `${this.baseUrl}/scenic/evaluation/add`,
      data: { orderId, ticketId, score, content, imageList },
      success
    });
  }

  async getHotelOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/hotel/order/list`,
        data: { status, page, limit },
        loadingTitle: "正在加载"
      })) || {};
    return list;
  }

  async searchHotelOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/hotel/order/search`,
      data: { keywords },
      loadingTitle: "正在加载"
    });
  }

  async getHotelVerifyCode(orderId, hotelId) {
    return await this.get({
      url: `${this.baseUrl}/hotel/order/verify_code`,
      data: { orderId, hotelId }
    });
  }

  async confirmHotelOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/order/confirm`,
      data: { id },
      success
    });
  }

  async cancelHotelOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/order/cancel`,
      data: { id },
      success
    });
  }

  async refundHotelOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/order/refund`,
      data: { id },
      success
    });
  }

  async deleteHotelOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/hotel/order/delete`,
      data: { id },
      success
    });
  }

  async submitHotelEvaluation(
    orderId,
    hotelId,
    score,
    content,
    imageList,
    success
  ) {
    return await this.post({
      url: `${this.baseUrl}/hotel/evaluation/add`,
      data: { orderId, hotelId, score, content, imageList },
      success
    });
  }

  async getMealTicketOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/meal_ticket/order/list`,
        data: { status, page, limit },
        loadingTitle: "正在加载"
      })) || {};
    return list;
  }

  async searchMealTicketOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/order/search`,
      data: { keywords },
      loadingTitle: "正在加载"
    });
  }

  async getMealTicketVerifyCode(orderId, restaurantId) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/order/verify_code`,
      data: { orderId, restaurantId }
    });
  }

  async confirmMealTicketOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/confirm`,
      data: { id },
      success
    });
  }

  async cancelMealTicketOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/cancel`,
      data: { id },
      success
    });
  }

  async refundMealTicketOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/refund`,
      data: { id },
      success
    });
  }

  async deleteMealTicketOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/delete`,
      data: { id },
      success
    });
  }

  async getSetMealOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/set_meal/order/list`,
        data: { status, page, limit },
        loadingTitle: "正在加载"
      })) || {};
    return list;
  }

  async searchSetMealOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/catering/set_meal/order/search`,
      data: { keywords },
      loadingTitle: "正在加载"
    });
  }

  async getSetMealVerifyCode(orderId, restaurantId) {
    return await this.get({
      url: `${this.baseUrl}/catering/set_meal/order/verify_code`,
      data: { orderId, restaurantId }
    });
  }

  async confirmSetMealOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/confirm`,
      data: { id },
      success
    });
  }

  async cancelSetMealOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/cancel`,
      data: { id },
      success
    });
  }

  async refundSetMealOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/refund`,
      data: { id },
      success
    });
  }

  async deleteSetMealOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/delete`,
      data: { id },
      success
    });
  }

  async getGoodsOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/order/list`,
        data: { status, page, limit },
        loadingTitle: "正在加载"
      })) || {};
    return list;
  }

  async searchGoodsOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/order/search`,
      data: { keywords },
      loadingTitle: "正在加载"
    });
  }

  async getOrderHistoryKeywords(productType) {
    return await this.get({
      url: `${this.baseUrl}/order/keyword/list`,
      data: { productType },
      loadingTitle: "正在加载"
    });
  }

  async saveOrderKeywords(productType, keywords) {
    return await this.post({
      url: `${this.baseUrl}/order/keyword/add`,
      data: { productType, keywords }
    });
  }

  async clearOrderHistoryKeywords(productType) {
    return await this.post({
      url: `${this.baseUrl}/order/keyword/clear`,
      data: { productType }
    });
  }

  async getGoodsVerifyCode(orderId) {
    return await this.get({
      url: `${this.baseUrl}/order/verify_code`,
      data: { orderId }
    });
  }

  async confirmGoodsOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/order/confirm`,
      data: { id },
      success
    });
  }

  async cancelGoodsOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/order/cancel`,
      data: { id },
      success
    });
  }

  async refundGoodsOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/order/refund`,
      data: { id },
      success
    });
  }

  async deleteGoodsOrder(ids, success) {
    await this.post({
      url: `${this.baseUrl}/order/delete`,
      data: { ids },
      success
    });
  }

  async getEvaluation(orderId) {
    return await this.get({
      url: `${this.baseUrl}/goods/evaluation/detail`,
      data: { orderId },
      loadingTitle: "正在加载"
    });
  }

  async submitEvaluation(
    status,
    orderId,
    goodsIds,
    score,
    content,
    imageList,
    success
  ) {
    return await this.post({
      url: `${this.baseUrl}/goods/evaluation/${status === 501 ? 'edit' : 'add'}`,
      data: { orderId, goodsIds, score, content, imageList },
      success
    });
  }

  async getRefundAddressInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/shop/refund_address/detail`,
      data: { id }
    });
  }
}

export default OrderService;
