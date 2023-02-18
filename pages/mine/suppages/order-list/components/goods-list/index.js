Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array
  },
  
  methods: {
    navToGoodsDetail(e) {
      const { id } = e.currentTarget.dataset
      const url = `/pages/mall/subpages/goods/subpages/goods-detail/index?id=${id}`
      wx.navigateTo({ url })
    },
  }
})
