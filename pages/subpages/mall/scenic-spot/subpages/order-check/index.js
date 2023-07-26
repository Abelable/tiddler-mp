import ScenicService from "../../utils/scenicService";

const scenicService = new ScenicService();

Page({
  data: {
    ticketInfo: null,
    categoryName: "",
    priceList: [],
    paymentAmount: 0,
    recentlyDateList: [],
    curDateIdx: 0,
    bookable: true,
    num: 1,
    priceDetailPopupVisible: false,
    noticePopupVisible: false,
  },

  async onLoad({ ticketId, categoryId }) {
    this.ticketId = ticketId;
    this.categoryId = categoryId;
    await this.setPreOrderInfo();
    this.setRecentlyDateList();
  },

  async setPreOrderInfo() {
    const { recentlyDateList, curDateIdx, num } = this.data;
    const { ticketInfo, categoryName, priceList, bookable, paymentAmount } =
      await scenicService.getScenicPreOrderInfo(
        this.ticketId,
        this.categoryId,
        recentlyDateList.length
          ? recentlyDateList[curDateIdx].timeStamp
          : undefined,
        num
      );

    this.setData({
      ticketInfo: {
        ...ticketInfo,
        bookingTips: bookable ? "可定今日" : "可定明日",
      },
      curDateIdx: bookable ? 0 : 1,
      bookable,
      categoryName,
      priceList,
      paymentAmount,
    });
  },

  setRecentlyDateList() {
    const timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    const timeStampList = [timeStamp, timeStamp + 86400, timeStamp + 86400 * 2];
    const recentlyDateList = timeStampList.map((timeStamp, index) => {
      const { price } =
        this.data.priceList.find(
          (item) => timeStamp >= item.startDate && timeStamp <= item.endDate
        ) || {};
      const curDate = new Date(timeStamp * 1000);
      const curMonth = `${curDate.getMonth() + 1}`.padStart(2, "0");
      const curDay = `${curDate.getDate()}`.padStart(2, "0");
      const curWeekDay =
        index === 2
          ? `周${["日", "一", "二", "三", "四", "五", "六"][curDate.getDay()]}`
          : index === 0
          ? "今天"
          : "明天";
      return {
        date: `${curWeekDay} ${curMonth}-${curDay}`,
        timeStamp,
        price,
      };
    });
    this.setData({ recentlyDateList });
  },

  selectDate(e) {
    const curDateIdx = Number(e.currentTarget.dataset.index);
    if (curDateIdx === 0 && !this.data.bookable) {
      return;
    }
    this.setData({ curDateIdx });
  },

  numChange({ detail: num }) {
    this.setData({ num });
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
