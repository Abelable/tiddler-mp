Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array,
    status: Number
  },
  
  methods: {
    navToGoodsDetail(e) {
      const { id } = e.currentTarget.dataset
      const url = `/pages/mall/subpages/goods/subpages/goods-detail/index?id=${id}`
      wx.navigateTo({ url })
    },

    afterSale(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/mine/suppages/order-list/subpages/detail/index?id=${id}`
      wx.navigateTo({ url })
    },
  }
})
