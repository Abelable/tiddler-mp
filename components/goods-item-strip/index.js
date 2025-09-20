Component({
  properties: {
    item: Object,
    showBorder: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    navToGoodsDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
