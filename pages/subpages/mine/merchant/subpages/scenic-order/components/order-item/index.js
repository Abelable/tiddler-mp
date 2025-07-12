Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    index: Number
  },

  methods: {
    // todo 联系客户
    contact() {},

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/merchant/subpages/scenic-order/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },
  }
});
