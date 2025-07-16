import OrderService from "../../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    orderInfo: null
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const orderInfo = await orderService.getHotelOrderDetail(this.orderId);
    this.setData({ orderInfo });

    const titleEnums = {
      101: "待付款",
      102: "交易关闭",
      103: "交易关闭",
      104: "交易关闭",
      201: "待商家确认",
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

    const { status, payTime, createdAt } = orderInfo;
    if (status === 101) {
      const countdown = Math.floor(
        (dayjs(createdAt).valueOf() + 24 * 60 * 60 * 1000 - dayjs().valueOf()) /
          1000
      );
      if (countdown > 0) {
        this.setData({ countdown });
        this.setCountdown();
      }
    }

    if (status === 201 || status === 301) {
      if (dayjs().diff(dayjs(payTime), "minute") <= 30) {
        this.setData({ refundBtnVisible: true });
      }
    }
  },

  setCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.data.countdown === 0) {
        clearInterval(this.countdownInterval);
        return;
      }
      this.setData({
        countdown: this.data.countdown - 1
      });
    }, 1000);
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderSn,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  },

  async payOrder() {
    const params = await orderService.getHotelPayParams(this.orderId);
    wx.requestPayment({
      ...params,
      success: () => {
        this.setData({
          ["orderInfo.status"]: 201
        });
      }
    });
  },

  refundOrder() {
    orderService.refundHotelOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 202
      });
    });
  },

  deleteOrder() {
    orderService.deleteHotelOrder(this.orderId, () => {
      wx.navigateBack();
    });
  },

  cancelOrder() {
    orderService.cancelHotelOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 102
      });
    });
  },

  async showQRcodeModal() {
    const { id, roomInfo } = this.data.orderInfo;
    const verifyCode = await orderService.getHotelVerifyCode(id, roomInfo.hotelId);
    this.setData({
      verifyCode,
      qRcodeModalVisible: true
    });
  },

  hideQRcodeModal() {
    this.setData({
      qRcodeModalVisible: false
    });
    this.setOrderInfo();
  },

  navToEvaluation() {
    const { hotelId } = this.data.orderInfo.roomInfo;
    const url = `../evaluation/index?orderId=${this.orderId}&hotelId=${hotelId}`;
    wx.navigateTo({ url });
  },

  // todo
  contact() {},

  // todo
  navToShop() {
    // const { id } = e.currentTarget.dataset
    // const url = `/pages/subpages/mall/goods/subpages/shop/index?id=${id}`
    // wx.navigateTo({ url })
  }
});
