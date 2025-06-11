import OrderService from "../../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    orderInfo: null,
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const orderInfo = await orderService.getScenicOrderDetail(this.orderId);
    this.setData({ orderInfo });

    const titleEnums = {
      101: "等待买家付款",
      102: "交易关闭",
      103: "交易关闭",
      104: "交易关闭",
      201: "出行确认中",
      202: "退款申请中",
      203: "退款成功",
      301: "交易成功",
      302: "交易成功",
      401: "交易成功",
    };
    wx.setNavigationBarTitle({
      title: titleEnums[orderInfo.status],
    });
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderSn,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      },
    });
  },

  async payOrder() {
    const params = await orderService.getScenicPayParams(this.orderId);
    wx.requestPayment({
      ...params,
      success: () => {
        this.setData({
          ["orderInfo.status"]: 201,
        });
      },
    });
  },

  refundOrder() {
    orderService.refundScenicOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 203,
      });
    });
  },

  confirmOrder() {
    orderService.confirmScenicOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 401,
      });
    });
  },

  deleteOrder() {
    orderService.deleteScenicOrder(this.orderId, () => {
      wx.navigateBack();
    });
  },

  cancelOrder() {
    orderService.cancelScenicOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 102,
      });
    });
  },

  navToEvaluation() {
    const { id } = this.data.orderInfo.ticketInfo;
    const url = `../evaluation/index?orderId=${this.orderId}&ticketId=${id}`;
    wx.navigateTo({ url });
  },

  navToAfterSale() {},

  contact() {},

  navToShop(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/goods/subpages/shop/index?id=${id}`;
    wx.navigateTo({ url });
  },
});
