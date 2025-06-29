import GoodsService from "../../utils/goodsOrderService";

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
    },

     deliverOrder() {
      // todo 发货

      // const { item, index } = this.properties;
      // const { id } = item;
      // goodsService.deliverOrder(id, () => {
      //   this.triggerEvent("update", { type: "deliver", index });
      // });
    },

    contact() {},

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/merchant/subpages/goods-order/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },
  }
});
