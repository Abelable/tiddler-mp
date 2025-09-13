import CateringService from "../../utils/cateringService";

const cateringService = new CateringService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  data: {
    statusBarHeight,
    restaurantName: "",
    setMealInfo: null,
    paymentAmount: 0,
    num: 1,
    discount: 0,
    limitTips: "",
    usageTips: "",
    detailPopupVisible: false,
    noticePopupVisible: false
  },

  methods: {
    onLoad({ restaurantId, restaurantName, setMealId }) {
      this.restaurantId = restaurantId;
      this.restaurantName = restaurantName;
      this.setMealId = setMealId;

      this.setData({ restaurantName });
      this.setSetMealInfo();
      this.setPaymentAmount();
    },

    async setSetMealInfo() {
      const setMealInfo = await cateringService.getSetMealInfo(this.setMealId);
      const {
        price,
        originalPrice,
        buyLimit,
        perTableUsageLimit,
        useTimeList,
        needPreBook
      } = setMealInfo;

      const discount = parseFloat(((price / originalPrice) * 10).toFixed(1));

      const limitTipList = [];
      if (buyLimit) {
        limitTipList.push(`每人每日限购${buyLimit}张`);
      }
      if (perTableUsageLimit) {
        limitTipList.push(`每桌限用${buyLimit}张`);
      }

      const usageTipsList = [];
      if (useTimeList.length) {
        usageTipsList.push("部分时段可用");
      } else {
        usageTipsList.push("营业时间可用");
      }
      if (needPreBook) {
        usageTipsList.push("需预约");
      } else {
        usageTipsList.push("免预约");
      }

      this.setData({
        setMealInfo,
        discount,
        limitTips: limitTipList.join("，"),
        usageTips: usageTipsList.slice(0, 3).join("｜")
      });
    },

    async setPaymentAmount() {
      const { paymentAmount } =
        (await cateringService.getSetMealPaymentAmount(
          this.setMealId,
          this.data.num
        )) || {};
      this.setData({ paymentAmount });
    },

    numChange({ detail: num }) {
      this.setData({ num }, () => {
        this.setPaymentAmount();
      });
    },

    // 提交订单
    async submit() {
      const orderId = await cateringService.submitSetMealOrder(
        this.restaurantId,
        this.restaurantName,
        this.setMealId,
        this.data.num
      );
      orderId && this.pay(orderId);
    },

    async pay(orderId) {
      const payParams = await cateringService.getSetMealPayParams(orderId);
      wx.requestPayment({
        ...payParams,
        success: () => {
           wx.navigateTo({
            url: "/pages/subpages/mine/order/index?type=4&status=2",
          });
        },
        fail: () => {
          wx.navigateTo({
            url: "/pages/subpages/mine/order/index?type=4&status=1",
          });
        },
      });
    },

    showDetailPopup() {
      this.setData({
        detailPopupVisible: true
      });
    },

    hideDetailPopup() {
      this.setData({
        detailPopupVisible: false
      });
    },

    showNoticePopup() {
      this.setData({
        noticePopupVisible: true
      });
    },

    hideNoticePopup() {
      this.setData({
        noticePopupVisible: false
      });
    }
  }
});
