Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array
  },
  
  methods: {
    showGoodsDetail(e) {
      this.properties.isDetail && wx.navigateTo({ url: `/pages/subpages/mall/goods-detail/index?id=${e.currentTarget.dataset.id}` })
    },

    toRefund(e) {
      
    }
  }
})
