import { store } from "../../../../../../store/index";
import ScenicOrderService from "../../subpages/scenic-order/utils/scenicOrderService";

const scenicOrderService = new ScenicOrderService();

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
            const { scenicShopId } = store.userInfo;
            scenicOrderService.refundOrder(scenicShopId, item.id, () => {
              this.setData({ refundBtnVisible: false });
              this.triggerEvent("update", { type: "refund", index });
            });
          }
        }
      });
    },

    approveOrder() {
      const { item, index } = this.properties;
      const { scenicShopId } = store.userInfo;
      scenicOrderService.approveOrder(scenicShopId, item.id, () => {
        this.triggerEvent("update", { type: "approve", index });
      });
    },

    contact() {
      const { id, userInfo } = this.properties.item;
      const { id: userId, avatar, nickname } = userInfo;
      const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${id}&productType=1`;
      wx.navigateTo({ url });
    },

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/merchant/subpages/scenic-order/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
