import BaseService from '../../../../../../../services/baseService'

class HotelService extends BaseService {
  async getShopInfo() {
    return await this.get({
      url: `${this.baseUrl}/hotel/shop/my_shop_info`
    })
  }

  async getOrderList({ shopId, status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/hotel/order/shop_list`,
        data: { status, page, limit, shopId },
        loadingTitle: "加载中...",
      })) || {};
    return list;
  }

  async getOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/hotel/order/detail`,
      data: { id },
      loadingTitle: '加载中...'
    })
  }

  async cancelOrder(id, success) {
    await this.post({ 
      url: `${this.baseUrl}/hotel/order/cancel`, 
      data: { id },
      success
    })
  }

  async publishComment(order_id, comment_type, commentLists, success) {
    return await this.post({ 
      url: `${this.baseUrl}/hotel/order/comment`, 
      data: { order_id, comment_type, json_data: JSON.stringify(commentLists) }, 
      success, 
      loadingTitle: '发布中...' 
    })
  }
}

export default HotelService
