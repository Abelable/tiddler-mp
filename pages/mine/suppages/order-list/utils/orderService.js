import BaseService from '../../../../../services/baseService'

class OrderService extends BaseService {
  async getOrderList(status, page, size = 10) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/order/list`, data: { status, page, size, type: 'type' } })
  }

  async confirmOrder(order_id) {
    await this.post({ 
      url: `${this.mmsUrl}/api/v4/order/confirm`, 
      data: { order_id },
      success() {
        wx.showToast({ title: '操作成功', icon: 'none' })
      }
    })
  }

  async deleteOrder(order_id) {
    await this.post({ 
      url: `${this.mmsUrl}/api/v4/order/delete`, 
      data: { order_id },
      success() {
        wx.showToast({ title: '删除成功', icon: 'none' })
      }
    })
  }

  async cancelOrder(order_id) {
    await this.post({ 
      url: `${this.mmsUrl}/api/v4/order/cancel`, 
      data: { order_id },
      success() {
        wx.showToast({ title: '取消成功', icon: 'none' })
      }
    })
  }

  async getShippingTracker(order_id) {
    return await this.get({ url: `${this.mmsUrl}/api/v4/order/tracker-order-id`, data: { order_id } })
  }

  async publishComment(order_id, comment_type, commentLists, success) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/order/comment`, data: { order_id, comment_type, json_data: JSON.stringify(commentLists) }, success, loadingTitle: '发布中...' })
  }
}

export default OrderService
