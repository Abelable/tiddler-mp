import GoodsService from "../../utils/goodsService";

const goodsService = new GoodsService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    index: Number
  },

  methods: {
    cancelOrder(e) {
      const { item, index } = this.properties;
      const { id } = item;
      goodsService.cancelOrder(id, () => {
        this.triggerEvent("update", { type: "cancel", index });
      });
    },

    deliverOrder(e) {
      const { item, index } = this.properties;
      const { id } = item;
      goodsService.deleteOrder(id, () => {
        this.triggerEvent("update", { type: "deliver", index });
      });
    },

    navToDetail(e) {
      const id = e.currentTarget.dataset.id;
      const url = `../../subpages/order-detail/index?id=${id}`;
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
