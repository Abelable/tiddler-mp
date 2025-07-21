import dayjs from "dayjs";
import OrderService from "../../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    orderInfo: null,
    countdown: 0,
    refundBtnVisible: false,
    verifyCode: "",
    qRcodeModalVisible: false
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const orderInfo = await orderService.getMealTicketOrderDetail(this.orderId);
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

    if (status === 201) {
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
    const params = await orderService.getMealTicketPayParams(this.orderId);
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
    wx.showModal({
      title: "确定申请退款吗？",
      success: result => {
        if (result.confirm) {
          orderService.refundMealTicketOrder(this.orderId, () => {
            this.setData({
              ["orderInfo.status"]: 203
            });
          });
        }
      }
    });
  },

  deleteOrder() {
    wx.showModal({
      title: "确定删除该订单吗？",
      success: result => {
        if (result.confirm) {
          orderService.deleteMealTicketOrder(this.orderId, () => {
            wx.navigateBack();
          });
        }
      }
    });
  },

  cancelOrder() {
    wx.showModal({
      title: "确定取消该订单吗？",
      success: result => {
        if (result.confirm) {
          orderService.cancelMealTicketOrder(this.orderId, () => {
            this.setData({
              ["orderInfo.status"]: 102
            });
          });
        }
      }
    });
  },

  async showQRcodeModal() {
    const { id, ticketInfo } = this.data.orderInfo;
    const verifyCode = await orderService.getMealTicketVerifyCode(
      id,
      ticketInfo.restaurantId
    );
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
    const { id, restaurantId } = this.data.orderInfo;
    const url = `../evaluation/index?orderId=${id}&restaurantId=${restaurantId}`;
    wx.navigateTo({ url });
  },

  // todo 客服
  contact() {},

  navToRestaurant(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${id}`;
    wx.navigateTo({ url });
  }
});
