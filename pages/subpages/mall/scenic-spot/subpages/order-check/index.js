import ScenicService from "../../utils/scenicService";

const scenicService = new ScenicService();

Page({
  data: {
    ticketInfo: null,
    categoryName: "",
    priceList: [],
    paymentAmount: 0,
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
    pickedDate: "",
    num: 1,
    priceDetailPopupVisible: false,
    noticePopupVisible: false,
  },

  onLoad({ ticketId, categoryId }) {
    this.ticketId = ticketId;
    this.categoryId = categoryId;
    this.setPreOrderInfo();
  },

  async setPreOrderInfo() {
    const { pickedDate, num } = this.data;
    const { ticketInfo, categoryName, priceList, paymentAmount } =
      await scenicService.getScenicPreOrderInfo(
        this.ticketId,
        this.categoryId,
        pickedDate,
        num
      );

    const curDate = new Date();
    const curHour = `${curDate.getHours()}`.padStart(2, "0");
    const curMinute = `${curDate.getMinutes()}`.padStart(2, "0");
    const curTime = +`${curHour}${curMinute}`;

    this.setData({
      ticketInfo: {
        ...ticketInfo,
        bookingTips:
          curTime <= +ticketInfo.bookingTime.replace(":", "") ? "可定今日" : "可定明日",
      },
      categoryName,
      priceList,
      paymentAmount,
    });
  },

  selectDate(e) {
    const curDateIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curDateIdx });
  },

  // 提交订单
  async submit() {
    const orderId = await scenicService.submitOrder(this.cartIds, addressId);
    this.pay(orderId);
  },

  async pay(orderId) {
    const payParams = await scenicService.getPayParams(orderId);
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

  showNoticePopup() {
    this.setData({
      noticePopupVisible: true,
    });
  },

  hideNoticePopup() {
    this.setData({
      noticePopupVisible: false,
    });
  },
});
