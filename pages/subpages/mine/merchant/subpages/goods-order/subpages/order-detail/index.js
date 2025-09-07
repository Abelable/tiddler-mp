import { WEBVIEW_BASE_URL } from "../../../../../../../../config";
import { store } from "../../../../../../../../store/index";
import GoodsOrderService from "../../utils/goodsOrderService";

const goodsOrderService = new GoodsOrderService();

Page({
  data: {
    orderInfo: null
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const { shopId } = store.userInfo;
    const orderInfo = await goodsOrderService.getOrderDetail(
      shopId,
      this.orderId
    );
    this.setData({ orderInfo });

    const titleEnums = {
      101: "待付款",
      102: "交易关闭",
      103: "交易关闭",
      104: "交易关闭",
      201: "待发货",
      202: "待发货",
      203: "退款申请中",
      204: "退款成功",
      301: "待收货",
      302: "待使用",
      401: "交易成功",
      402: "交易成功",
      403: "交易成功",
      501: "交易成功",
      502: "交易成功"
    };
    wx.setNavigationBarTitle({
      title: titleEnums[orderInfo.status]
    });
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderSn,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  },

  copyAddress() {
    const { consignee, mobile, address } = this.data.orderInfo;
    wx.setClipboardData({
      data: `${consignee}，${mobile}，${address}`,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  },

  ship() {
    const { shopId } = store.userInfo;
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/ship&shop_id=${shopId}&order_id=${this.orderId}`;
    wx.navigateTo({ url });
  },

  async checkShippingInfo() {
    const { packageList, selectedPackageIdx } = this.data;
    const waybillToken = await orderService.getWaybillToken(
      packageList[selectedPackageIdx].id
    );
    plugin.openWaybillTracking({ waybillToken });
  },

  contact() {
    const { id, userInfo } = this.data.orderInfo;
    const { id: userId, avatar, nickname } = userInfo;
    const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${id}&productType=4`;
    wx.navigateTo({ url });
  }
});
