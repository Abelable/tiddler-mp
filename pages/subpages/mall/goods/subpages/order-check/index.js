import dayjs from "dayjs";
import { calcDistance } from "../../../../../../utils/index";
import { store } from "../../../../../../store/index";
import GoodsService from "../../utils/goodsService";

const goodsService = new GoodsService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    showBg: false,
    goodsDeliveryMode: 1,
    curMenuIdx: 0,
    preOrderInfo: null,
    addressPopupVisible: false,
    distance: "",
    pickupAddressList: [],
    curPickupAddressIdx: 0,
    pickupAddressPopupVisible: false,
    pickupTime: "",
    pickupTimePopupVisible: false,
    pickupMobile: "",
    mobileModalVisible: false,
    couponPopupVisible: false
  },

  async onLoad(options) {
    const { cartGoodsIds } = options || {};
    this.cartGoodsIds = JSON.parse(cartGoodsIds);

    await this.setPreOrderInfo();
    this.setGoodsDeliveryMode();
  },

  async setPreOrderInfo() {
    const preOrderInfo = await goodsService.getPreOrderInfo(
      this.data.curMenuIdx + 1,
      this.cartGoodsIds,
      this.addressId,
      this.couponId,
      this.useBalance
    );
    this.setData({ preOrderInfo });
  },

  async setGoodsDeliveryMode() {
    const { goodsLists } = this.data.preOrderInfo;
    if (goodsLists.length > 1) {
      this.setData({ goodsDeliveryMode: 1 });
    } else {
      const { goodsList } = goodsLists[0];
      const deliveryMode = goodsList[0].deliveryMode;
      const allSame = goodsList.every(item => item.deliveryMode === deliveryMode);
      if (allSame) {
        this.setData({ goodsDeliveryMode: deliveryMode });
      } else {
        this.setData({ goodsDeliveryMode: 1 });
      }
    }

    if (this.data.goodsDeliveryMode !== 1) {
      if (!store.locationInfo) {
        await goodsService.getLocationInfo();
      }
      this.setPickupAddressList(this.cartGoodsIds[0]);
    }
  },

  async setPickupAddressList(cartGoodsId) {
    const { longitude: lo1 = 0, latitude: la1 = 0 } = store.locationInfo || {};
    const list = await goodsService.getPickupAddressList(cartGoodsId);
    const pickupAddressList = list.map(item => {
      const { longitude, latitude } = item;
      const la2 = +latitude;
      const lo2 = +longitude;
      const distance = lo1 ? calcDistance(la1, lo1, la2, lo2) : 0;
      return { ...item, distance };
    });
    this.setData({ pickupAddressList });
  },

  selectMenu(e) {
    const curMenuIdx = +e.currentTarget.dataset.index;
    this.setData({ curMenuIdx });
    this.setPreOrderInfo();
  },

  showAddressPopup() {
    this.setData({
      addressPopupVisible: true
    });
  },

  confirmAddressSelect(e) {
    this.addressId = e.detail.id;
    this.setPreOrderInfo();
    this.hideAddressPopup();
  },

  hideAddressPopup(e) {
    this.setData({
      addressPopupVisible: false
    });
    if (e.detail) {
      this.addressId = e.detail;
      this.setPreOrderInfo();
    }
  },

  showPickupAddressPopup() {
    this.setData({
      pickupAddressPopupVisible: true
    });
  },

  confirmPickupAddressSelect(e) {
    const curPickupAddressIdx = e.detail.index;
    if (curPickupAddressIdx !== this.data.curPickupAddressIdx) {
      this.setData({ curPickupAddressIdx });
      this.setDistance();
    }
    this.hidePickupAddressPopup();
  },

  hidePickupAddressPopup() {
    this.setData({
      pickupAddressPopupVisible: false
    });
  },

  showPickupTimePopup() {
    this.setData({
      pickupTimePopupVisible: true
    });
  },

  confirmPickupTimeSelect(e) {
    const pickupTime = e.detail.time;
    this.setData({
      pickupTime,
      pickupTimePopupVisible: false
    });
  },

  hidePickupTimePopup() {
    this.setData({
      pickupTimePopupVisible: false
    });
  },

  showMobileModal() {
    this.setData({
      mobileModalVisible: true
    });
  },

  confirmMobileSet(e) {
    const { mobile } = e.detail;
    this.setData({
      pickupMobile: mobile,
      mobileModalVisible: false
    });
  },

  hideMobileModal() {
    this.setData({
      mobileModalVisible: false
    });
  },

  toggleUseBalance(e) {
    this.useBalance = e.detail.value;
    this.setPreOrderInfo();
  },

  showCouponPopup() {
    this.setData({
      couponPopupVisible: true
    });
  },

  confirmCouponSelect(e) {
    this.couponId = e.detail.id;
    this.setPreOrderInfo();
    this.hideCouponPopup();
  },

  hideCouponPopup() {
    this.setData({
      couponPopupVisible: false
    });
  },

  // 提交订单
  async submit() {
    const {
      preOrderInfo,
      goodsDeliveryMode,
      curMenuIdx,
      pickupAddressList,
      curPickupAddressIdx,
      pickupTime,
      pickupMobile
    } = this.data;
    const { errMsg, addressInfo = {}, couponList } = preOrderInfo;
    const addressId = addressInfo.id || "";
    if (errMsg) {
      return;
    }
    if (
      (goodsDeliveryMode === 1 ||
        (goodsDeliveryMode === 3 && curMenuIdx === 0)) &&
      !addressId
    ) {
      return;
    }
    if (
      (goodsDeliveryMode === 2 ||
        (goodsDeliveryMode === 3 && curMenuIdx === 1)) &&
      (!pickupTime || !pickupMobile)
    ) {
      return;
    }
    if (this.couponId === undefined && couponList.length) {
      this.couponId = couponList[0].id;
    }
    const orderIds = await goodsService.submitOrder({
      deliveryMode: curMenuIdx + 1,
      addressId: curMenuIdx === 0 ? addressId : "",
      pickupAddressId:
        curMenuIdx === 1 ? pickupAddressList[curPickupAddressIdx].id : "",
      pickupTime:
        curMenuIdx === 1 ? dayjs(pickupTime).format("YYYY-MM-DD HH:mm:ss") : "",
      pickupMobile: curMenuIdx === 1 ? pickupMobile : "",
      cartGoodsIds: this.cartGoodsIds,
      couponId: this.couponId || undefined,
      useBalance: this.useBalance ? 1 : 0
    });
    if (orderIds) {
      this.pay(orderIds);
    }
  },

  async pay(orderIds) {
    const { curMenuIdx } = this.data;
    const url = `/pages/subpages/mine/order/index?type=5&status=${
      curMenuIdx === 0 ? 2 : 3
    }`;
    const payParams = await goodsService.getPayParams(orderIds);
    if (payParams) {
      wx.requestPayment({
        ...payParams,
        success: () => {
          wx.navigateTo({ url });
        },
        fail: () => {
          wx.navigateTo({
            url: "/pages/subpages/mine/order/index?type=5&status=1"
          });
        }
      });
    } else if (this.useBalance) {
      wx.navigateTo({ url });
    }
  },

  navigation() {
    const { pickupAddressList, curPickupAddressIdx } = this.data;
    const { name, addressDetail, longitude, latitude } =
      pickupAddressList[curPickupAddressIdx];
    wx.openLocation({
      latitude: +latitude,
      longitude: +longitude,
      name: name || addressDetail,
      address: addressDetail
    });
  },

  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    if (scrollTop > 20 && !this.data.showBg) {
      this.setData({ showBg: true });
    } else if (scrollTop <= 20 && this.data.showBg) {
      this.setData({ showBg: false });
    }
  }
});
