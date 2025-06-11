import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()

Page({
  data: {
    orderInfo: null
  },
  
  onLoad({ id }) {
    this.orderId = id
    this.setOrderInfo()
  },

  async setOrderInfo() {
    const orderInfo = await goodsService.getOrderDetail(this.orderId)
    this.setData({ orderInfo })

    const titleEnums = {
      101: '待付款',
      102: '交易关闭',
      103: '交易关闭',
      104: '交易关闭',
      201: '待发货',
      202: '待发货',
      203: '退款申请中',
      204: '退款成功',
      301: '待收货',
      302: '待使用',
      401: '交易成功',
      402: '交易成功',
      403: '交易成功',
    }
    wx.setNavigationBarTitle({
      title: titleEnums[orderInfo.status],
    })
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderSn, 
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'none' })
      }
    })
  },

  copyAddress() {
    const { consignee, mobile, address } = this.data.orderInfo
    wx.setClipboardData({
      data: `${consignee}，${mobile}，${address}`, 
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'none' })
      }
    })
  },

  deliverOrder() {
    goodsService.deliverOrder(id, () => {
      this.setData({
        ['orderInfo.status']: 301
      })
    })
  },

  cancelOrder() {
    goodsService.cancelOrder(this.orderId, () => {
      this.setData({
        ['orderInfo.status']: 102
      })
    })
  },

  navToShipping(e) {
    const id = e.currentTarget.dataset.id
    const url = `/pages/subpages/mine/order/subpages/goods-order-list/subpages/shipping/index?id=${id}`
    wx.navigateTo({ url })
  },

  contact() {
  },
})
