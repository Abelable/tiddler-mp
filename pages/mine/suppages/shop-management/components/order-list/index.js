import ShopService from '../../utils/shopService'

const shopService = new ShopService()

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array
  },
  
  methods: {
    cancelOrder(e) {
      const { id, index } = e.currentTarget.dataset
      shopService.cancelOrder(id, () => {
        this.triggerEvent('update', { type: 'cancel', index })
      })
    },

    deliverOrder(e) {
      const { id, index } = e.currentTarget.dataset
      shopService.deleteOrder(id, () => {
        this.triggerEvent('update', { type: 'deliver', index })
      })
    },
  
    navToDetail(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/mine/suppages/shop-management/subpages/order-detail/index?id=${id}`
      wx.navigateTo({ url })
    },
  
    navToShipping(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/mine/suppages/shop-management/subpages/shipping/index?id=${id}`
      wx.navigateTo({ url })
    },

    contactBuyer() {}
  }
})
