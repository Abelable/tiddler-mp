Component({
  properties: {
    item: Object,
    showTag: Boolean
  },

  data: {
    visible: false,
  },

  methods: {
    onCoverLoaded(e) {
      const { width, height } = e.detail;
      const coverHeight = 350 / width * height;
      this.setData({
        [`item.coverHeight`]:
          coverHeight > 480 ? 480 : coverHeight < 260 ? 260 : coverHeight
      });
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
