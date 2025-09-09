import dayjs from "dayjs";
import OrderService from "../../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    orderInfo: null,
    countdown: 0,
    refundBtnVisible: false,
    verifyCode: "",
    qrCodeModalVisible: false
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const orderInfo = await orderService.getSetMealOrderDetail(this.orderId);
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
      301: "待使用",
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
    const params = await orderService.getSetMealPayParams(this.orderId);
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
          orderService.refundSetMealOrder(this.orderId, () => {
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
          orderService.deleteSetMealOrder(this.orderId, () => {
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
          orderService.cancelSetMealOrder(this.orderId, () => {
            this.setData({
              ["orderInfo.status"]: 102
            });
          });
        }
      }
    });
  },

  async showQRcodeModal() {
    const { id, setMealInfo } = this.data.orderInfo;
    const verifyCode = await orderService.getSetMealVerifyCode(
      id,
      setMealInfo.restaurantId
    );
    this.setData({
      verifyCode,
      qrCodeModalVisible: true
    });
  },

  hideQRcodeModal() {
    this.setData({
      qrCodeModalVisible: false
    });
    this.setOrderInfo();
  },

  contact() {
    const { id, userInfo } = this.data.orderInfo;
    const { id: userId, avatar, nickname } = userInfo;
    const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${id}&productType=6`;
    wx.navigateTo({ url });
  },

  afterSale() {},

  navToEvaluation() {
    const { id, restaurantId } = this.data.orderInfo;
    const url = `../evaluation/index?orderId=${id}&restaurantId=${restaurantId}`;
    wx.navigateTo({ url });
  },

  navToRestaurant() {
    const { restaurantId } = this.data.orderInfo;
    const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${restaurantId}`;
    wx.navigateTo({ url });
  },

  navToSetMealDetail(e) {
    const { restaurantId, restaurantName } = this.data.orderInfo;
    const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/subpages/set-meal-detail/index?setMealId=${e.detail}&restaurantId=${restaurantId}&restaurantName=${restaurantName}`;
    wx.navigateTo({ url });
  },

  onUnload() {
    clearInterval(this.countdownInterval);
  }
});
