import CateringService from "../../../utils/cateringService";

const cateringService = new CateringService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    index: Number
  },

  methods: {
    cancelOrder() {
      const { item, index } = this.properties;
      const { id } = item;
      cateringService.cancelMealTicketOrder(id, () => {
        this.triggerEvent("update", { type: "cancel", index });
      });
    },

    navToDetail(e) {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/merchant/subpages/catering-management/subpages/meal-ticket-order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    contact() {},

    copyOrderSn() {
      const { orderSn } = this.properties.item;
      wx.setClipboardData({
        data: orderSn,
        success: () => {
          wx.showToast({ title: "复制成功", icon: "none" });
        }
      });
    },

    copyAddress() {
      const { consignee, mobile, address } = this.properties.item;
      wx.setClipboardData({
        data: `${consignee}，${mobile}，${address}`,
        success: () => {
          wx.showToast({ title: "复制成功", icon: "none" });
        }
      });
    }
  }
});
