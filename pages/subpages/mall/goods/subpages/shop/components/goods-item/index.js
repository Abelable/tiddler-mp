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
        url: `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${this.properties.item.id}`
      })
    },
  }
})
