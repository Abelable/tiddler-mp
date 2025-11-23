const dayjs = require("dayjs");

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    orderInfo: Object
  },

  data: {
    refundBtnVisible: false
  },

  lifetimes: {
    attached() {
      const { item, orderInfo } = this.properties;
      if (
        [401, 402, 403, 501, 502].includes(orderInfo.status) &&
        item.refundStatus === 1 &&
        dayjs().diff(dayjs(orderInfo.confirmTime), "day") <= 7
      ) {
        this.setData({ refundBtnVisible: true });
      }
    }
  },

  methods: {
    navToGoodsDetail() {
      const { goodsId } = this.properties.item;
      const url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${goodsId}`;
      wx.navigateTo({ url });
    },

    applyRefund() {
      const { item, orderInfo } = this.properties;
      const { shopId, goodsId, refundAddressId } = item;
      const { id: orderId, orderSn, couponId } = orderInfo;
      const url = `/pages/subpages/mine/order/subpages/goods-order/refund/index?orderId=${orderId}&orderSn=${orderSn}&couponId=${couponId}&shopId=${shopId}&goodsId=${goodsId}&refundAddressId=${refundAddressId}`;
      wx.navigateTo({ url });
    }
  }
});
