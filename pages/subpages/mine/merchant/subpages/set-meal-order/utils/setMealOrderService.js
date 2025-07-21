import MerchantService from '../../../utils/merchantService'

class SetMealOrderService extends MerchantService {
  async getOrderList({ shopId, status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/shop/set_meal/order/list`,
        data: { status, page, limit, shopId },
        loadingTitle: "加载中...",
      })) || {};
    return list;
  }

  async getOrderDetail(shopId, orderId) {
    return await this.get({
      url: `${this.baseUrl}/catering/shop/set_meal/order/detail`,
      data: { shopId, orderId },
      loadingTitle: '加载中...'
    })
  }

  async approveOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/catering/shop/set_meal/order/approve`,
      data: { shopId, orderId },
      success
    });
  }

  async refundOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/catering/shop/set_meal/order/refund`,
      data: { shopId, orderId },
      success
    });
  }
}

export default SetMealOrderService
