Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    showTag: Boolean
  },

  data: {
    visible: false,
  },

  methods: {
    onCoverLoaded() {
      this.setData({ visible: true });
    },
    
    navToGoodsDetail() {
      wx.navigateTo({
        url: `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${this.properties.item.id}`
      })
    },

    navToShop() {
      wx.navigateTo({
        url: `/pages/subpages/mall/goods/subpages/shop/index?id=${this.properties.item.shopInfo.id}`
      })
    },
  }
})
