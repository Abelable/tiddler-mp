import { WEBVIEW_BASE_URL } from "../../../../../../../../config";
import RefundService from "../../utils/refundService";

const refundService = new RefundService();

Page({
  data: {
    refundInfo: null
  },

  onLoad({ shopId, id }) {
    this.shopId = +shopId;
    this.refundId = +id;
    this.setRefundInfo();
  },

  async setRefundInfo() {
    const refundInfo = await refundService.getRefundDetail(
      this.shopId,
      this.refundId
    );
    this.setData({ refundInfo });

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
      302: "待自提",
      401: "交易成功",
      402: "交易成功",
      403: "交易成功",
      501: "交易成功",
      502: "交易成功"
    };
    wx.setNavigationBarTitle({
      title: titleEnums[refundInfo.status]
    });
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.refundInfo.orderSn,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  },

  copyAddress() {
    const { consignee, mobile, address } = this.data.refundInfo;
    wx.setClipboardData({
      data: `${consignee}，${mobile}，${address}`,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  },

  ship() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/ship&shop_id=${this.shopId}&order_id=${this.refundId}`;
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
    const { id, userInfo } = this.data.refundInfo;
    const { id: userId, avatar, nickname } = userInfo;
    const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&refundId=${id}&productType=4`;
    wx.navigateTo({ url });
  }
});
