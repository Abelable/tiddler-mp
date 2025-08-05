import MerchantService from "../../../utils/merchantService";

class ScenicOrderService extends MerchantService {
  async getOrderList({ shopId, status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/scenic/shop/order/list`,
        data: { status, page, limit, shopId },
        loadingTitle: "加载中"
      })) || {};
    return list;
  }

  async getOrderDetail(shopId, orderId) {
    return await this.get({
      url: `${this.baseUrl}/scenic/shop/order/detail`,
      data: { shopId, orderId },
      loadingTitle: "加载中"
    });
  }

  async approveOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/shop/order/approve`,
      data: { shopId, orderId },
      success
    });
  }

  async refundOrder(shopId, orderId, success) {
    await this.post({
      url: `${this.baseUrl}/scenic/shop/order/refund`,
      data: { shopId, orderId },
      success
    });
  }
}

export default ScenicOrderService;
