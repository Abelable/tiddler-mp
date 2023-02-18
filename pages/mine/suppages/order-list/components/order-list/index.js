import OrderService from '../../utils/orderService'

const orderService = new OrderService()

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    status: Number,
    list: Array
  },
  
  methods: {
    async pay(e) {
      const { status, list } = this.properties
      const { id, index } = e.currentTarget.dataset
      const params = await orderService.getPayParams([id])
      wx.requestPayment({ ...params,
        success: () => {
          if (status === 0) {
            this.setData({
              [`list[${index}].status`]: 201
            })
          } else {
            list.splice(index, 1)
            this.setData({ list })
          }
        }
      })
    },

    refund() {},

    confirmOrder(e) {
      const { status, list } = this.properties
      const { id, index } = e.currentTarget.dataset
      orderService.confirmOrder(id, () => {
        if (status === 0) {
          this.setData({
            [`list[${index}].status`]: 401
          })
        } else {
          list.splice(index, 1)
          this.setData({ list })
        }
      })
    },

    deleteOrder(e) {
      const id = e.currentTarget.dataset.id
      orderService.deleteOrder(id)
    },

    cancelOrder(e) {
      const { status, list } = this.properties
      const { id, index } = e.currentTarget.dataset
      orderService.cancelOrder(id, () => {
        if (status === 0) {
          this.setData({
            [`list[${index}].status`]: 102
          })
        } else {
          list.splice(index, 1)
          this.setData({ list })
        }
      })
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
