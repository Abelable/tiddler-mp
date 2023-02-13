Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  methods: {
    navToGoodsDetail() {
      wx.navigateTo({
        url: `/pages/mall/subpages/goods/subpages/goods-detail/index?id=${this.properties.item.id}`
      })
    },
  }
})
