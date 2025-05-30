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
    const orderInfo = await orderService.getSetMealOrderDetail(this.orderId);
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
    const params = await orderService.getSetMealPayParams(this.orderId);
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
    orderService.refundSetMealOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 202,
      });
    });
  },

  confirmOrder() {
    orderService.confirmSetMealOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 401,
      });
    });
  },

  deleteOrder() {
    orderService.deleteSetMealOrder(this.orderId, () => {
      wx.navigateBack();
    });
  },

  cancelOrder() {
    orderService.cancelSetMealOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 102,
      });
    });
  },

  navToEvaluation(e) {
    const id = e.currentTarget.dataset.id;
    const url = `/pages/subpages/mine/order/subpages/goods-order-list/subpages/evaluation/index?id=${id}`;
    wx.navigateTo({ url });
  },

  contact() {},

  afterSale() {},

  navToEvaluation() {
    const { id, restaurantId } = this.data.orderInfo;
    const url = `../evaluation/index?orderId=${id}&restaurantId=${restaurantId}`;
    wx.navigateTo({ url });
  },

  navToSetMealDetail(e) {
    const { restaurantId, restaurantName } = this.data.orderInfo;
    const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/subpages/set-meal-detail/index?setMealId=${e.detail}&restaurantId=${restaurantId}&restaurantName=${restaurantName}`;
    wx.navigateTo({ url });
  },
});
