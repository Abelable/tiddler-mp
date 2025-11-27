import OrderService from "../../../../utils/orderService";

class RefundService extends OrderService {
  async getRefundAmount(orderId, goodsId, couponId) {
    return await this.get({
      url: `${this.baseUrl}/refund/amount`,
      data: { orderId, goodsId, couponId }
    });
  }

  async getRefund(orderId, goodsId) {
    return await this.get({
      url: `${this.baseUrl}/refund/detail`,
      data: { orderId, goodsId }
    });
  }

  async addRefund(
    shopId,
    orderId,
    orderSn,
    orderGoodsId,
    goodsId,
    couponId,
    refundAddressId,
    type,
    reason,
    imageList,
    success
  ) {
    await this.post({
      url: `${this.baseUrl}/refund/add`,
      data: {
        shopId,
        orderId,
        orderSn,
        orderGoodsId,
        goodsId,
        couponId,
        refundAddressId,
        type,
        reason,
        imageList
      },
      success
    });
  }

  async editRefund(id, type, reason, imageList, success) {
    await this.post({
      url: `${this.baseUrl}/refund/edit`,
      data: { id, type, reason, imageList },
      success
    });
  }

  async submitShipInfo(id, shipChannel, shipCode, shipSn, success) {
    await this.post({
      url: `${this.baseUrl}/refund/submit_shipping_info`,
      data: { id, shipChannel, shipCode, shipSn },
      success
    });
  }
}

export default RefundService;
