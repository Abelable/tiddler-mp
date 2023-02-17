import OrderService from '../../utils/orderService'

const orderService = new OrderService()

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array
  },
  
  methods: {
    async pay(e) {
      const id = e.currentTarget.dataset.id
      const params = await orderService.prepay(id)
      wx.requestPayment({ ...params,
        success: () => {

        }
      })
    },

    confirmOrder(e) {
      const id = e.currentTarget.dataset.id
      orderService.confirmOrder(id)
    },

    deleteOrder(e) {
      const id = e.currentTarget.dataset.id
      orderService.deleteOrder(id)
    },

    cancelOrder(e) {
      const id = e.currentTarget.dataset.id
      orderService.cancelOrder(id)
    },
  
    navToDetail(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/mine/suppages/order-list/subpages/detail/index?id=${id}`
      wx.navigateTo({ url })
    },
  
    navToShipping(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/mine/suppages/order-list/subpages/shipping/index?id=${id}`
      wx.navigateTo({ url })
    },

    navToComment(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/mine/suppages/order-list/subpages/comment/index?id=${id}`
      wx.navigateTo({ url })
    },
  }
})
