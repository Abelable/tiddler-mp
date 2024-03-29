import BaseService from "../../../../../../../services/baseService";

class OrderService extends BaseService {
  async getOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/scenic/order/list`,
        data: { status, page, limit },
        loadingTitle: "加载中...",
      })) || {};
    return list;
  }

  async getOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/scenic/order/detail`,
      data: { id },
      loadingTitle: "加载中...",
    });
  }

  async confirmOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/order/confirm`,
      data: { id },
      success,
    });
  }

  async cancelOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/order/cancel`,
      data: { id },
      success,
    });
  }

  async refundOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/order/refund`,
      data: { id },
      success,
    });
  }

  async deleteOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/order/delete`,
      data: { id },
      success,
    });
  }

  async submitEvaluation(orderId, ticketId, score, content, imageList, success) {
    return await this.post({ 
      url: `${this.baseUrl}/scenic/evaluation/add`, 
      data: { orderId, ticketId, score, content, imageList }, 
      success, 
    })
  }
}

export default OrderService;
