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
    const shopId = store.userInfo.merchantInfo.shopIds[0];
    const orderInfo = await goodsOrderService.getOrderDetail(shopId, this.orderId);
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
      403: "交易成功"
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

  deliverOrder() {
    // todo 发货
    // goodsOrderService.deliverOrder(id, () => {
    //   this.setData({
    //     ['orderInfo.status']: 301
    //   })
    // })
  },

  async checkShippingInfo() {
    const { packageList, selectedPackageIdx } = this.data;
    const waybillToken = await orderService.getWaybillToken(
      packageList[selectedPackageIdx].id
    );
    plugin.openWaybillTracking({ waybillToken });
  },

  // todo 联系客户：电话or私聊
  contact() {}
});
