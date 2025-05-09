import BaseService from "../../../../../services/baseService";

class OrderService extends BaseService {
  async getScenicOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/scenic/order/list`,
        data: { status, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async searchScenicOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/scenic/order/search`,
      data: { keywords },
      loadingTitle: "加载中..."
    });
  }

  async getScenicHistoryKeywords() {
    return await this.get({
      url: `${this.baseUrl}/scenic/order/keyword/list`,
      loadingTitle: "加载中..."
    });
  }

  async saveScenicKeywords(keywords) {
    return await this.post({
      url: `${this.baseUrl}/scenic/order/keyword/add`,
      data: { keywords }
    });
  }

  async clearScenicHistoryKeywords() {
    return await this.post({
      url: `${this.baseUrl}/scenic/order/keyword/clear`
    });
  }

  async getScenicOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/scenic/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
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
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async searchHotelOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/hotel/order/search`,
      data: { keywords },
      loadingTitle: "加载中..."
    });
  }

  async getHotelHistoryKeywords() {
    return await this.get({
      url: `${this.baseUrl}/hotel/order/keyword/list`,
      loadingTitle: "加载中..."
    });
  }

  async saveHotelKeywords(keywords) {
    return await this.post({
      url: `${this.baseUrl}/hotel/order/keyword/add`,
      data: { keywords }
    });
  }

  async clearHotelHistoryKeywords() {
    return await this.post({
      url: `${this.baseUrl}/hotel/order/keyword/clear`
    });
  }

  async getHotelOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/hotel/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
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
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async searchMealTicketOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/order/search`,
      data: { keywords },
      loadingTitle: "加载中..."
    });
  }

  async getMealTicketHistoryKeywords() {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/order/keyword/list`,
      loadingTitle: "加载中..."
    });
  }

  async saveMealTicketKeywords(keywords) {
    return await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/keyword/add`,
      data: { keywords }
    });
  }

  async clearMealTicketHistoryKeywords() {
    return await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/keyword/clear`
    });
  }

  async getMealTicketOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
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
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async searchSetMealOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/catering/set_meal/order/search`,
      data: { keywords },
      loadingTitle: "加载中..."
    });
  }

  async getSetMealHistoryKeywords() {
    return await this.get({
      url: `${this.baseUrl}/catering/set_meal/order/keyword/list`,
      loadingTitle: "加载中..."
    });
  }

  async saveSetMealKeywords(keywords) {
    return await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/keyword/add`,
      data: { keywords }
    });
  }

  async clearSetMealHistoryKeywords() {
    return await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/keyword/clear`
    });
  }

  async getSetMealOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/set_meal/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
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
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async searchGoodsOrderList(keywords) {
    return await this.get({
      url: `${this.baseUrl}/order/search`,
      data: { keywords },
      loadingTitle: "加载中..."
    });
  }

  async getGoodsHistoryKeywords() {
    return await this.get({
      url: `${this.baseUrl}/order/keyword/list`,
      loadingTitle: "加载中..."
    });
  }

  async saveGoodsKeywords(keywords) {
    return await this.post({
      url: `${this.baseUrl}/order/keyword/add`,
      data: { keywords }
    });
  }

  async clearGoodsHistoryKeywords() {
    return await this.post({
      url: `${this.baseUrl}/order/keyword/clear`
    });
  }

  async getGoodsOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
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

  async deleteGoodsOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/order/delete`,
      data: { id },
      success
    });
  }

  async getShippingTracker(order_id) {
    return await this.get({
      url: `${this.baseUrl}/order/tracker-order-id`,
      data: { order_id }
    });
  }

  async getEvaluation(orderId) {
    return await this.get({
      url: `${this.baseUrl}/goods/evaluation/detail`,
      data: { orderId },
      loadingTitle: "加载中..."
    });
  }

  async submitEvaluation(
    orderId,
    goodsIds,
    score,
    content,
    imageList,
    success
  ) {
    return await this.post({
      url: `${this.baseUrl}/goods/evaluation/add`,
      data: { orderId, goodsIds, score, content, imageList },
      success
    });
  }
}

export default OrderService;
