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

    navToShop() {
      wx.navigateTo({
        url: `/pages/mall/subpages/goods/subpages/shop/index?id=${this.properties.item.shopInfo.id}`
      })
    },
  }
})
