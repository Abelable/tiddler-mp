import dayjs from "dayjs";
import { calcDistance } from "../../../../../../utils/index";
import { store } from "../../../../../../store/index";
import GoodsService from "../../utils/goodsService";

const goodsService = new GoodsService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
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
    mobileModalVisible: false
  },

  async onLoad(options) {
    const { cartGoodsIds, deliveryMode = 1 } = options || {};
    this.cartGoodsIds = JSON.parse(cartGoodsIds);

    const goodsDeliveryMode = +deliveryMode;
    this.setData({ goodsDeliveryMode });
    if (goodsDeliveryMode !== 1) {
      if (!store.locationInfo) {
        await goodsService.getLocationInfo();
      }
      this.setPickupAddressList(this.cartGoodsIds[0]);
    }

    this.setPreOrderInfo();
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

  async setPreOrderInfo() {
    const preOrderInfo = await goodsService.getPreOrderInfo(
      this.data.curMenuIdx + 1,
      this.cartGoodsIds,
      this.addressId,
      this.useBalance
    );
    this.setData({ preOrderInfo });
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
    const { errMsg, addressInfo = {} } = preOrderInfo;
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
    const orderIds = await goodsService.submitOrder({
      deliveryMode: curMenuIdx + 1,
      addressId: curMenuIdx === 0 ? addressId : "",
      pickupAddressId:
        curMenuIdx === 1 ? pickupAddressList[curPickupAddressIdx].id : "",
      pickupTime:
        curMenuIdx === 1 ? dayjs(pickupTime).format("YYYY-MM-DD HH:mm:ss") : "",
      pickupMobile: curMenuIdx === 1 ? pickupMobile : "",
      cartGoodsIds: this.cartGoodsIds,
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
  }
});
