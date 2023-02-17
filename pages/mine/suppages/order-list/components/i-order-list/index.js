import OrderService from '../../utils/orderService'
let orderService = new OrderService()

Component({
  properties: {
    order: Object
  },
  
  methods: {
    showOrderDetail(e) {
      wx.navigateTo({ url: `./order-detail/index?id=${e.currentTarget.dataset.orderId}` })
    },
  
    showShippingDetail(e) {
      wx.navigateTo({ url: `./order-detail/subpages/shipping/index?id=${e.currentTarget.dataset.id}` })
    },

    async handleOrder(e) {
      let { orderId, type } = e.currentTarget.dataset
      switch (type) {
        case 'confirm':
          await orderService.confirmOrder(orderId)
          break
        case 'delete':
          await orderService.deleteOrder(orderId)
          break
        case 'cancel':
          await orderService.cancelOrder(orderId)
          break
      }
      this.triggerEvent('handleOrder')
    },
  
    async pay(e) {
      let res = await orderService.prepay(e.currentTarget.dataset.sn) || ''
      if (res) {
        const { timeStamp, ...rest } = JSON.parse(res)
        wx.requestPayment({ ...rest,
          timeStamp: String(timeStamp),
          success: () => {
            this.triggerEvent('finishPay')
          }
        })
      }
    },

    navToComment(e) {
      wx.navigateTo({
        url: `./order-detail/subpages/comment/index?id=${e.currentTarget.dataset.orderId}`
      })
    }
  }
})