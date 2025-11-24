Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    navigable: Boolean
  },

  methods: {
    navToGoodsDetail() {
      const { navigable, item } = this.properties;
      if (navigable) {
        const url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${item.goodsId}`;
        wx.navigateTo({ url });
      }
    }
  }
});
