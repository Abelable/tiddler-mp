import { store } from "../../../../../../../../store/index";
import ScenicOrderService from "../../utils/scenicOrderService";

const scenicOrderService = new ScenicOrderService();

Page({
  data: {
    orderInfo: null
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const { scenicShopId } = store.userInfo;
    const orderInfo = await scenicOrderService.getOrderDetail(
      scenicShopId,
      this.orderId
    );
    this.setData({ orderInfo });

    const titleEnums = {
      201: "待确认",
      202: "退款申请中",
      203: "退款成功",
      204: "交易关闭",
      301: "待出行",
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

  refundOrder() {
    wx.showModal({
      title: "确定取消订单吗？",
      success: result => {
        if (result.confirm) {
          const { scenicShopId } = store.userInfo;
          scenicOrderService.refundOrder(scenicShopId, this.orderId, () => {
            this.setOrderInfo();
          });
        }
      }
    });
  },

  approveOrder() {
    const { scenicShopId } = store.userInfo;
    scenicOrderService.approveOrder(scenicShopId, this.orderId, () => {
      this.setOrderInfo();
    });
  },

  // todo 联系客户
  contact() {}
});
