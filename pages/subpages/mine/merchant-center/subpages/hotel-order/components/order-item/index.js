import HotelService from "../../utils/hotelService";

const hotelService = new HotelService();

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
      hotelService.cancelOrder(id, () => {
        this.triggerEvent("update", { type: "cancel", index });
      });
    },

    checkedOrder() {
      const { item, index } = this.properties;
      const { id } = item;
      hotelService.checkedOrder(id, () => {
        this.triggerEvent("update", { type: "checked", index });
      });
    },

    navToDetail() {
      const { id } = this.properties.item;
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
