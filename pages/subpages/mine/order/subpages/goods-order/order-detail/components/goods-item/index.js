const dayjs = require("dayjs");

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    orderInfo: Object,
    item: Object
  },

  data: {
    refundBtnVisible: false
  },

  lifetimes: {
    attached() {
      const { item, orderInfo } = this.properties;
      if (
        [203, 401, 402, 403, 501, 502].includes(orderInfo.status) &&
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
      const { orderInfo, item } = this.properties;
      const { id: orderId, orderSn, couponId } = orderInfo;
      const { id: orderGoodsId, shopId, goodsId, refundAddressId } = item;
      const url = `/pages/subpages/mine/order/subpages/goods-order/refund/index?orderId=${orderId}&orderSn=${orderSn}&couponId=${couponId}&orderGoodsId=${orderGoodsId}&shopId=${shopId}&goodsId=${goodsId}&refundAddressId=${refundAddressId}`;
      wx.navigateTo({ url });
    }
  }
});
