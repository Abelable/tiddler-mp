import OrderService from '../../../utils/orderService'

const orderService = new OrderService()

Page({
  data: {
    orderInfo: null
  },
  
  onLoad({ id }) {
    this.orderId = id
    this.setOrderInfo()
  },

  async setOrderInfo() {
    const orderInfo = await orderService.getHotelOrderDetail(this.orderId)
    this.setData({ orderInfo })

    const titleEnums = {
      101: '等待买家付款',
      102: '交易关闭',
      103: '交易关闭',
      104: '交易关闭',
      201: '等待卖家发货',
      202: '退款申请中',
      203: '退款成功',
      301: '待收货',
      401: '交易成功',
      402: '交易成功',
      501: '交易成功',
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

  async payOrder() {
    const params = await orderService.getHotelPayParams(this.orderId)
    wx.requestPayment({ ...params,
      success: () => {
        this.setData({
          ['orderInfo.status']: 201
        })
      }
    })
  },

  refundOrder() {
    orderService.refundHotelOrder(this.orderId, () => {
      this.setData({
        ['orderInfo.status']: 202
      })
    })
  },

  confirmOrder() {
    orderService.confirmHotelOrder(this.orderId, () => {
      this.setData({
        ['orderInfo.status']: 401
      })
    })
  },

  deleteOrder() {
    orderService.deleteHotelOrder(this.orderId, () => {
      wx.navigateBack()
    })
  },

  cancelOrder() {
    orderService.cancelHotelOrder(this.orderId, () => {
      this.setData({
        ['orderInfo.status']: 102
      })
    })
  },

  navToEvaluation() {
    const {hotelId} = this.data.orderInfo.roomInfo 
    const url = `../evaluation/index?orderId=${this.orderId}&hotelId=${hotelId}`
    wx.navigateTo({ url })
  },

  contact() {
  },

  navToShop(e) {
    const { id } = e.currentTarget.dataset
    const url = `/pages/subpages/mall/goods/subpages/shop/index?id=${id}`
    wx.navigateTo({ url })
  },
})
