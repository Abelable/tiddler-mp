Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array,
    canShowDetail: {
      type: Boolean,
      value: true
    }
  },
  
  methods: {
    navToGoodsDetail(e) {
      if (this.properties.canShowDetail) {
        const { id } = e.currentTarget.dataset
        const url = `/pages/mall/subpages/goods/subpages/goods-detail/index?id=${id}`
        wx.navigateTo({ url })
      }
    },
  }
})
