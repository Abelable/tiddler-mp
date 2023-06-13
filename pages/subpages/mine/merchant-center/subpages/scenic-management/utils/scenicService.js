import BaseService from '../../../../../../../services/baseService'

class ScenicService extends BaseService {
  async getShopInfo() {
    return await this.get({
      url: `${this.baseUrl}/scenic/shop/my_shop_info`
    })
  }

  async getOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/order/detail`,
      data: { id },
      loadingTitle: '加载中...'
    })
  }

  async cancelOrder(id, success) {
    await this.post({ 
      url: `${this.baseUrl}/order/cancel`, 
      data: { id },
      success
    })
  }

  async getShippingTracker(order_id) {
    return await this.get({ url: `${this.baseUrl}/order/tracker-order-id`, data: { order_id } })
  }

  async publishComment(order_id, comment_type, commentLists, success) {
    return await this.post({ 
      url: `${this.baseUrl}/order/comment`, 
      data: { order_id, comment_type, json_data: JSON.stringify(commentLists) }, 
      success, 
      loadingTitle: '发布中...' 
    })
  }
}

export default ScenicService