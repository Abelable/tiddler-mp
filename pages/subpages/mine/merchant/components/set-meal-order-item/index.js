import MerchantService from "../../utils/merchantService";

const merchantService = new MerchantService();

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
    refundOrder() {
      wx.showModal({
        title: "确定取消订单吗？",
        success: result => {
          if (result.confirm) {
            const { shopId, item, index } = this.properties;
            merchantService.refundSetMealOrder(shopId, item.id, () => {
              this.setData({ ['item.status']: 203 });
              this.triggerEvent("update", { type: "refund", index });
            });
          }
        }
      });
    },

    approveOrder() {
      const { shopId, item, index } = this.properties;
      merchantService.approveSetMealOrder(shopId, item.id, () => {
        this.triggerEvent("update", { type: "approve", index });
      });
    },

    contact() {
      const { id, userInfo } = this.properties.item;
      const { id: userId, avatar, nickname } = userInfo;
      const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${id}&productType=6`;
      wx.navigateTo({ url });
    },

    navToDetail() {
      const { shopId, item } = this.properties;
      const url = `/pages/subpages/mine/merchant/subpages/set-meal-order/subpages/order-detail/index?shopId=${shopId}&id=${item.id}`;
      wx.navigateTo({ url });
    }
  }
});
