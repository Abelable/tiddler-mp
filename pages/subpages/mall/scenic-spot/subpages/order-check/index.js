import SpotService from "../../utils/spotService";

const spotService = new SpotService();

Page({
  data: {
    preOrderInfo: {
      paymentAmount: 67.5
    },
    priceDetailPopupVisible: false
  },

  onLoad({ id }) {
    this.ticketId = +id;
  },

  // 提交订单
  async submit() {
    const orderId = await spotService.submitOrder(this.cartIds, addressId);
    this.pay(orderId);
  },

  async pay(orderId) {
    const payParams = await spotService.getPayParams(orderId);
    wx.requestPayment({
      ...payParams,
      success: () => {
        wx.navigateTo({
          url: "/pages/mine/suppages/order-list/index?status=2",
        });
      },
      fail: () => {
        wx.navigateTo({
          url: "/pages/mine/suppages/order-list/index?status=1",
        });
      },
    });
  },

  togglePriceDetailPopupVisible() {
    this.setData({
      priceDetailPopupVisible: !this.data.priceDetailPopupVisible
    })
  },
});
