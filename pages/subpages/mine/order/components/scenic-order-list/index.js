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
    async payOrder(e) {
      const { id, index } = e.currentTarget.dataset
      const params = await orderService.getScenicPayParams(id)
      wx.requestPayment({ ...params,
        success: () => {
          this.triggerEvent('update', { type: 'pay', index })
        }
      })
    },

    refundOrder(e) {
      const { id, index } = e.currentTarget.dataset
      orderService.refundScenicOrder(id, () => {
        this.triggerEvent('update', { type: 'refund', index })
      })
    },

    confirmOrder(e) {
      const { id, index } = e.currentTarget.dataset
      orderService.confirmScenicOrder(id, () => {
        this.triggerEvent('update', { type: 'confirm', index })
      })
    },

    deleteOrder(e) {
      const { id, index } = e.currentTarget.dataset
      orderService.deleteScenicOrder(id, () => {
        this.triggerEvent('update', { type: 'delete', index })
      })
    },

    cancelOrder(e) {
      const { id, index } = e.currentTarget.dataset
      orderService.cancelScenicOrder(id, () => {
        this.triggerEvent('update', { type: 'cancel', index })
      })
    },
  
    navToDetail(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/subpages/mine/order/subpages/scenic-order/order-detail/index?id=${id}`
      wx.navigateTo({ url })
    },

    navToEvaluation(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/subpages/mine/order/subpages/scenic-order/evaluation/index?id=${id}`
      wx.navigateTo({ url })
    },

    // todo
    // navToShop(e) {
    //   const { id } = e.currentTarget.dataset
    //   const url = `/pages/subpages/mall/goods/subpages/shop/index?id=${id}`
    //   wx.navigateTo({ url })
    // },
  }
})
