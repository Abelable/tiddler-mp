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
    paymentAmount: 0,
    recentlyDateList: [],
    curDateIdx: 0,
    num: 1,
    consignee: "",
    mobile: "",
    priceDetailPopupVisible: false,
    noticePopupVisible: false,
  },

  methods: {
    onLoad() {
      this.setPaymentAmount();
    },

    async setPaymentAmount() {
      const { hotelPreOrderInfo, checkInDate, checkOutDate, num } = this.data;
      const { paymentAmount } = await hotelService.getPaymentAmount(
        hotelPreOrderInfo.id,
        Math.floor(checkInDate / 1000),
        Math.floor(checkOutDate / 1000),
        num
      ) || {};
      this.setData({ paymentAmount });
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
      const payParams = await hotelService.getHotelPayParams(orderId);
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
