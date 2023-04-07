import SpotService from "../../utils/spotService";

const spotService = new SpotService();

Page({
  data: {
    preOrderInfo: {
      paymentAmount: 40,
    },
    recentlyDataList: [
      {
        date: "今天 04-06",
        price: 40,
      },
      {
        date: "明天 04-07",
        price: 40,
      },
      {
        date: "周一 04-08",
        price: 40,
      },
    ],
    curDateIdx: 0,
    priceDetailPopupVisible: false,
  },

  onLoad({ id }) {
    this.ticketId = +id;
  },

  selectDate(e) {
    const curDateIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curDateIdx });
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
      priceDetailPopupVisible: !this.data.priceDetailPopupVisible,
    });
  },
});
