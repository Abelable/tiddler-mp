import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import HotelService from "../../utils/hotelService";

const hotelService = new HotelService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["hotelPreOrderInfo", "checkInDate", "checkOutDate"],
  },

  data: {
    statusBarHeight,
    navBarActive: false,
    minDate: 0,
    maxDate: 0,
    paymentAmount: 0,
    recentlyDateList: [],
    curDateIdx: 0,
    num: 1,
    consignee: "",
    mobile: "",
    priceDetailPopupVisible: false,
    noticePopupVisible: false,
    validityTimeDesc: "",
  },

  methods: {
    async setPaymentAmount() {
      const { hotelPreOrderInfo, recentlyDateList, curDateIdx, num } =
        this.data;
      const { id: ticketId, categoryId } = hotelPreOrderInfo;
      const { timeStamp } = recentlyDateList[curDateIdx];

      const paymentAmount = await hotelService.getPaymentAmount(
        ticketId,
        categoryId,
        timeStamp,
        num
      );
      this.setData({ paymentAmount });
    },

    async setValidityTimeDesc() {
      const { hotelPreOrderInfo, recentlyDateList, curDateIdx } = this.data;
      const { validityTime } = hotelPreOrderInfo;
      const { timeStamp } = recentlyDateList[curDateIdx];

      const startDate = new Date(timeStamp * 1000);
      const startMonth = `${startDate.getMonth() + 1}`.padStart(2, "0");
      const startDay = `${startDate.getDate()}`.padStart(2, "0");

      const endDate = new Date((timeStamp + 86400 * validityTime) * 1000);
      const endMonth = `${endDate.getMonth() + 1}`.padStart(2, "0");
      const endDay = `${endDate.getDate()}`.padStart(2, "0");

      const validityTimeDesc = `${startMonth}月${startDay}日至${endMonth}月${endDay}日内有效`;

      this.setData({ validityTimeDesc });
    },

    numChange({ detail: num }) {
      this.setData({ num }, () => {
        this.setPaymentAmount();
      });
    },

    setConsignee(e) {
      const consignee = e.detail.value;
      this.setData({ consignee });
    },

    setMobile(e) {
      const mobile = e.detail.value;
      this.setData({ mobile });
    },

    // 提交订单
    async submit() {
      const {
        hotelPreOrderInfo,
        recentlyDateList,
        curDateIdx,
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

      const { id, categoryId } = hotelPreOrderInfo;
      const { timeStamp } = recentlyDateList[curDateIdx];

      const orderId = await hotelService.submitOrder(
        id,
        categoryId,
        timeStamp,
        num,
        consignee,
        mobile
      );
      this.pay(orderId);
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

    onPageScroll({ scrollTop }) {
      if (scrollTop > 10) {
        if (!this.data.navBarActive) {
          this.setData({ navBarActive: true });
        }
      } else {
        if (this.data.navBarActive) {
          this.setData({ navBarActive: false });
        }
      }
    },
  },
});
