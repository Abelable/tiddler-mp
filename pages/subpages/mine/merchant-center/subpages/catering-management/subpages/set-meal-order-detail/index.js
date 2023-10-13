import CateringService from "../../utils/cateringService";

const cateringService = new CateringService();

Page({
  data: {
    orderInfo: null,
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const orderInfo = await cateringService.getSetMealOrderDetail(this.orderId);
    this.setData({ orderInfo });

    const titleEnums = {
      101: "等待买家付款",
      102: "交易关闭",
      103: "交易关闭",
      104: "交易关闭",
      201: "等待卖家发货",
      202: "退款申请中",
      203: "退款成功",
      301: "待收货",
      401: "交易成功",
      402: "交易成功",
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

  copyAddress() {
    const { consignee, mobile, address } = this.data.orderInfo;
    wx.setClipboardData({
      data: `${consignee}，${mobile}，${address}`,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      },
    });
  },

  deliverOrder() {
    cateringService.deliverOrder(id, () => {
      this.setData({
        ["orderInfo.status"]: 301,
      });
    });
  },

  cancelOrder() {
    cateringService.cancelOrder(this.orderId, () => {
      this.setData({
        ["orderInfo.status"]: 102,
      });
    });
  },

  contact() {},

  navToSetMealDetail(e) {
    const { restaurantId, restaurantName } = this.data.orderInfo;
    const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/subpages/set-meal-detail/index?setMealId=${e.detail}&restaurantId=${restaurantId}&restaurantName=${restaurantName}`;
    wx.navigateTo({ url });
  },
});
