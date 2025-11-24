import RefundService from "../../utils/refundService";

const refundService = new RefundService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    shopId: Number,
    item: Object,
    index: Number
  },

  methods: {
    approve() {
      const { shopId, item, index } = this.properties;
      wx.showModal({
        title: `确定同意${item.refundType === 1 ? "退款" : "退货"}吗？`,
        success: result => {
          if (result.confirm) {
            refundService.approveRefund(shopId, item.id, () => {
              this.setData({ ["item.status"]: 1 });
              this.triggerEvent("update", { type: "approve", index });
            });
          }
        }
      });
    },

    reject() {
      const { id } = this.properties.item;
      this.triggerEvent("reject", { id });
    },

    confirm() {
      const { shopId, item, index } = this.properties;
      wx.showModal({
        title: "确认收货之前，请核实物流信息",
        content: "点击确定，确认收货并退款",
        success: result => {
          if (result.confirm) {
            refundService.approveRefund(shopId, item.id, () => {
              this.setData({ ["item.status"]: 3 });
              this.triggerEvent("update", { type: "approve", index });
            });
          }
        }
      });
    },

    copyOrderSn() {
      const { orderSn } = this.properties.item;
      wx.setClipboardData({
        data: orderSn,
        success: () => {
          wx.showToast({ title: "复制成功", icon: "none" });
        }
      });
    },

    contact() {
      const { orderId, userInfo } = this.properties.item;
      const { id: userId, avatar, nickname } = userInfo;
      const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${orderId}&productType=4`;
      wx.navigateTo({ url });
    },

    async checkShippingInfo() {
      const { refundAddressInfo, shipCode, shipSn } = this.properties.item;
      const { mobile } = refundAddressInfo;
      const url = `/pages/subpages/common/shipping/index?shipCode=${shipCode}&shipSn=${shipSn}&mobile=${mobile}`;
      wx.navigateTo({ url });
    },

    navToDetail() {
      const { shopId, item } = this.properties;
      const url = `/pages/subpages/mine/merchant/subpages/goods-refund/subpages/refund-detail/index?shopId=${shopId}&id=${item.id}`;
      wx.navigateTo({ url });
    }
  }
});
