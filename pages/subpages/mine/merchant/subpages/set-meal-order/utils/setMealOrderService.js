import MerchantService from '../../../utils/merchantService'

class SetMealOrderService extends MerchantService {
  async getOrderList({ shopId, status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/shop/set_meal/order/list`,
        data: { status, page, limit, shopId },
        loadingTitle: "正在加载",
      })) || {};
    return list;
  }

  async getOrderDetail(shopId, orderId) {
    return await this.get({
      url: `${this.baseUrl}/catering/shop/set_meal/order/detail`,
      data: { shopId, orderId },
      loadingTitle: '正在加载'
    })
  }
}

export default SetMealOrderService
