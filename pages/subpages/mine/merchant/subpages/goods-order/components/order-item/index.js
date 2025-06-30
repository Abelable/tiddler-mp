import { store } from "../../../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../../../config";

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
      const shopId = store.userInfo.merchantInfo.shopIds[0];
      const { id } = this.properties.item;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/ship&shop_id=${shopId}&order_id=${id}`;
      wx.navigateTo({ url });
    },

    // todo 联系客户
    contact() {},

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/merchant/subpages/goods-order/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
