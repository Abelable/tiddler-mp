import { WEBVIEW_BASE_URL } from "../../../../../../config";
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

    ship() {
      const { shopId, item } = this.properties;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/goods/shop/order_ship&shop_id=${shopId}&order_id=${item.id}`;
      wx.navigateTo({ url });
    },

    refund() {
      wx.showModal({
        title: "确定退款吗？",
        success: result => {
          if (result.confirm) {
            const { shopId, item, index } = this.properties;
            merchantService.refundGoodsOrder(shopId, item.id, () => {
              this.setData({ ["item.status"]: 204 });
              this.triggerEvent("update", { type: "refund", index });
            });
          }
        }
      });
    },

    contact() {
      const { id, userInfo } = this.properties.item;
      const { id: userId, avatar, nickname } = userInfo;
      const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${id}&productType=4`;
      wx.navigateTo({ url });
    },

    navToDetail() {
      const { shopId, item } = this.properties;
      const url = `/pages/subpages/mine/merchant/subpages/goods-order/subpages/order-detail/index?shopId=${shopId}&id=${item.id}`;
      wx.navigateTo({ url });
    }
  }
});
