import OrderService from '../utils/orderService'

let orderService = new OrderService()

Page({
  data: {
    orderInfo: null,
    time: 0
  },
  
  onLoad(options) {
    this.orderId = options.id
    this.setOrderInfo()
    this.supplierAvatar = 'https://img.ubo.vip/mp/default-ubo-icon.png'
    this.supplierName = '官方客服'
  },

  async setOrderInfo() {
    const orderInfo = await orderService.getOrderDetail(this.orderId)
    this.setData({ orderInfo })
  },

  async setSupplierInfo(id) {
    let { supplier_img, supplier_name } = await orderService.getSupplierInfo(id)
    this.supplierAvatar = supplier_img
    this.supplierName = supplier_name
  },

  countDown(time) {
    this.countDown = setInterval(() => {
      this.setData({
        time: time--
      })
      time === 0 && (clearInterval(this.countDown), this.countDown = null)
    }, 1000)
  },

  copyOrderNumber() {
    wx.setClipboardData({
      data: this.data.orderInfo.order_sn, 
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'none' })
      }
    })
  },

  showShippingDetail() {
    wx.navigateTo({ url: `./subpages/shipping/index?id=${this.orderId}` })
  },

  async contact() {
    const { shop_id, chat_id, shop_name,  } = this.data.orderInfo
    if (shop_id != 0 && shop_id != 1) {
      wx.navigateTo({
        url: `/pages/subpages/news/chat/index?friendId=${chat_id}&friendName=${shop_name}&friendAvatarUrl=${this.supplierAvatar}&orderId=${this.orderId}`
      })
    } else {
      wx.openCustomerServiceChat({
        extInfo: await orderService.getCustomServiceLink(),
        corpId: 'ww8ad0becbaec61c9a',
      })
    }
  },

  navToComment() {
    wx.navigateTo({
      url: `./subpages/comment/index?id=${this.orderId}`
    })
  },

  onUnload() {
    this.countDown && clearInterval(this.countDown)
  }
})