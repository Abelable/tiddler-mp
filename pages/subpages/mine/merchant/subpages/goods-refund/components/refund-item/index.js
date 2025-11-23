import { store } from "../../../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../../../config";
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

    approve() {
      const { shopId, item, index } = this.properties;
      wx.showModal({
        title: `确定${item.refundType === 1 ? "同意退款" : "同意退货"}吗？`,
        success: result => {
          if (result.confirm) {
            refundService.refundGoodsOrder(shopId, item.id, () => {
              this.setData({ ["item.status"]: 204 });
              this.triggerEvent("update", { type: "refund", index });
            });
          }
        }
      });
    },

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/merchant/subpages/goods-refund/subpages/refund-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
