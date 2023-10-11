import CateringService from "../../utils/cateringService";

const cateringService = new CateringService();

Component({
  data: {
    ticketInfo: null,
    paymentAmount: 0,
    num: 1,
    noticePopupVisible: false,
    ticketInfo: null,
    discount: 0,
    limitTips: "",
    useTimeDescList: [],
    inapplicableProductsDesc: "",
  },

  methods: {
    onLoad({ restaurantId, restaurantName, ticketId }) {
      this.restaurantId = restaurantId;
      this.restaurantName = restaurantName;
      this.ticketId = ticketId;
      this.setMealTicketInfo();
      this.setPaymentAmount();
    },

    async setMealTicketInfo() {
      const ticketInfo = await cateringService.getMealTicketInfo(this.ticketId);
      const {
        price,
        originalPrice,
        buyLimit,
        perTableUsageLimit,
        overlayUsageLimit,
        useTimeList,
        inapplicableProducts,
      } = ticketInfo;

      const discount = parseFloat(((price / originalPrice) * 10).toFixed(1));

      const limitTipList = [];
      if (buyLimit) {
        limitTipList.push(`每人每日限购${buyLimit}张`);
      }
      if (perTableUsageLimit) {
        limitTipList.push(`每桌限用${buyLimit}张`);
      }
      if (overlayUsageLimit) {
        limitTipList.push(`单次可用${buyLimit}张`);
      }

      this.setUseTimeDescList(useTimeList);

      if (inapplicableProducts)
        this.setData({
          ticketInfo,
          discount,
          limitTips: limitTipList.join("，"),
          inapplicableProductsDesc: inapplicableProducts.join("、"),
        });
    },

    setUseTimeDescList(useTimeList) {
      const useTimeDescList = useTimeList.map((time) => {
        const startWeekDay = weekDayList.find(
          (week) => week.value == time.startWeekDay
        ).text;
        const endWeekDay = weekDayList.find(
          (week) => week.value == time.endWeekDay
        ).text;
        const timeFrameDesc = time.timeFrameList
          .map((timeFrame) => `${timeFrame.openTime}-${timeFrame.closeTime}`)
          .join();
        return `${startWeekDay}至${endWeekDay}: ${timeFrameDesc}`;
      });

      this.setData({ useTimeDescList });
    },

    async setPaymentAmount() {
      const paymentAmount = await cateringService.getMealTicketPaymentAmount(
        this.ticketId,
        this.data.num
      );
      this.setData({ paymentAmount });
    },

    numChange({ detail: num }) {
      this.setData({ num }, () => {
        this.setPaymentAmount();
      });
    },

    // 提交订单
    async submit() {
      const {
        hotelPreOrderInfo,
        checkInDate,
        checkOutDate,
        num,
        consignee,
        mobile,
      } = this.data;
      if (!consignee || !mobile) {
        return;
      }
      if (!/^1[345789][0-9]{9}$/.test(mobile)) {
        wx.showToast({
          title: "请输入正确手机号",
          icon: "none",
        });
        return;
      }

      const orderId = await hotelService.submitOrder(
        hotelPreOrderInfo.id,
        Math.floor(checkInDate / 1000),
        Math.floor(checkOutDate / 1000),
        num,
        consignee,
        mobile
      );
      orderId && this.pay(orderId);
    },

    async pay(orderId) {
      const payParams = await hotelService.getHotelOrderPayParams(orderId);
      wx.requestPayment({
        ...payParams,
        success: () => {
          wx.navigateTo({
            url: "/pages/subpages/mine/order-center/subpages/hotel-order-list/index?status=2",
          });
        },
        fail: () => {
          wx.navigateTo({
            url: "/pages/subpages/mine/order-center/subpages/hotel-order-list/index?status=1",
          });
        },
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
