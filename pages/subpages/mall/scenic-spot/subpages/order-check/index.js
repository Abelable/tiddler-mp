import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import ScenicService from "../../utils/scenicService";

const scenicService = new ScenicService();

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["scenicPreOrderInfo"],
  },

  data: {
    paymentAmount: 0,
    recentlyDateList: [],
    curDateIdx: 0,
    num: 1,
    priceDetailPopupVisible: false,
    noticePopupVisible: false,
  },

  observers: {
    scenicPreOrderInfo: function (info) {
      info && this.setRecentlyDateList();
    },
  },

  methods: {
    async setPaymentAmount() {
      const { scenicPreOrderInfo, recentlyDateList, curDateIdx, num } =
        this.data;
      const { id: ticketId, categoryId } = scenicPreOrderInfo;
      const { timeStamp } = recentlyDateList[curDateIdx];

      const paymentAmount = await scenicService.getPaymentAmount(
        ticketId,
        categoryId,
        timeStamp,
        num
      );
      this.setData({ paymentAmount });
    },

    setRecentlyDateList() {
      const { priceList, todayBookable } = this.data.scenicPreOrderInfo;
      const timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
      const timeStampList = [
        timeStamp,
        timeStamp + 86400,
        timeStamp + 86400 * 2,
      ];
      const recentlyDateList = timeStampList.map((timeStamp, index) => {
        const { price } =
          priceList.find(
            (item) => timeStamp >= item.startDate && timeStamp <= item.endDate
          ) || {};
        const curDate = new Date(timeStamp * 1000);
        const curMonth = `${curDate.getMonth() + 1}`.padStart(2, "0");
        const curDay = `${curDate.getDate()}`.padStart(2, "0");
        const curWeekDay =
          index === 2
            ? `周${
                ["日", "一", "二", "三", "四", "五", "六"][curDate.getDay()]
              }`
            : index === 0
            ? "今天"
            : "明天";
        return {
          date: `${curWeekDay} ${curMonth}-${curDay}`,
          timeStamp,
          price,
        };
      });
      this.setData(
        { recentlyDateList, curDateIdx: todayBookable ? 0 : 1 },
        () => {
          this.setPaymentAmount();
        }
      );
    },

    selectDate(e) {
      const curDateIdx = Number(e.currentTarget.dataset.index);
      if (curDateIdx === 0 && !this.data.todayBookable) {
        return;
      }
      this.setData({ curDateIdx }, () => {
        this.setPaymentAmount();
      });
    },

    numChange({ detail: num }) {
      this.setData({ num }, () => {
        this.setPaymentAmount();
      });
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
  },
});
