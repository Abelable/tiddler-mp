import { store } from "../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../config";

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

    ship() {
      const { shopId } = store.userInfo;
      const { id } = this.properties.item;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/ship&shop_id=${shopId}&order_id=${id}`;
      wx.navigateTo({ url });
    },

    contact() {
      const { id, userInfo } = this.properties.item;
      const { id: userId, avatar, nickname } = userInfo;
      const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${id}&productType=4`;
      wx.navigateTo({ url });
    },

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/merchant/subpages/goods-order/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
