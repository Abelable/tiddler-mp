import { store } from "../../../../../../../../store/index";
import HotelOrderService from "../../utils/hotelOrderService";

const hotelOrderService = new HotelOrderService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    index: Number
  },

  methods: {
    refundOrder() {
      wx.showModal({
        title: "确定取消订单吗？",
        success: result => {
          if (result.confirm) {
            const { item, index } = this.properties;
            const { hotelShopId } = store.userInfo;
            hotelOrderService.refundOrder(hotelShopId, item.id, () => {
              this.setData({ refundBtnVisible: false });
              this.triggerEvent("update", { type: "refund", index });
            });
          }
        }
      });
    },

    approveOrder() {
      const { item, index } = this.properties;
      const { hotelShopId } = store.userInfo;
      hotelOrderService.approveOrder(hotelShopId, item.id, () => {
        this.triggerEvent("update", { type: "approve", index });
      });
    },

    // todo 联系客户
    contact() {},

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/merchant/subpages/hotel-order/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
