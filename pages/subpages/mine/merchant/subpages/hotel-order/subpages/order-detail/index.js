import { store } from "../../../../../../../../store/index";
import HotelOrderService from "../../utils/hotelOrderService";

const hotelOrderService = new HotelOrderService();

Page({
  data: {
    orderInfo: null
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const { hotelShopId } = store.userInfo;
    const orderInfo = await hotelOrderService.getOrderDetail(
      hotelShopId,
      this.orderId
    );
    this.setData({ orderInfo });

    const titleEnums = {
      201: "待确认",
      202: "退款申请中",
      203: "退款成功",
      204: "交易关闭",
      301: "待入住",
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
          const { hotelShopId } = store.userInfo;
          hotelOrderService.refundOrder(hotelShopId, this.orderId, () => {
            this.setOrderInfo();
          });
        }
      }
    });
  },

  approveOrder() {
    const { hotelShopId } = store.userInfo;
    hotelOrderService.approveOrder(hotelShopId, this.orderId, () => {
      this.setOrderInfo();
    });
  },

  contact() {
    const { id, userInfo } = this.data.orderInfo;
    const { id: userId, avatar, nickname } = userInfo;
    const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${id}&productType=2`;
    wx.navigateTo({ url });
  }
});
