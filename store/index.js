import { configure, observable, action } from "mobx-miniprogram";
import tim from "./modules/tim";
import live from "./modules/live/index";
import hotel from "./modules/hotel";

configure({ enforceActions: "observed" }); // 不允许在动作外部修改状态

export const store = observable({
  tabType: "home",
  userInfo: null,
  superiorInfo: null,
  merchantType: undefined,
  activeMediaItem: null,
  croppedImagePath: "",
  locationInfo: null,
  scenicPreOrderInfo: null,
  hotelPreOrderInfo: null,
  mediaProductList: [],
  orderTotal: [],
  scenicOrderTotal: [],
  hotelOrderTotal: [],
  setMealOrderTotal: [],
  mealTicketOrderTotal: [],
  goodsOrderTotal: [],

  setTabType: action(function (type) {
    this.tabType = type;
  }),
  setUserInfo: action(function (info) {
    this.userInfo = info;
  }),
  setSuperiorInfo: action(function (info) {
    this.superiorInfo = info;
  }),
  setMerchantType: action(function (type) {
    this.merchantType = type;
  }),
  setActiveMediaItem: action(function (info) {
    this.activeMediaItem = info;
  }),
  setCroppedImagePath: action(function (path) {
    this.croppedImagePath = path;
  }),
  setLocationInfo: action(function (info) {
    this.locationInfo = info;
  }),
  setScenicPreOrderInfo: action(function (info) {
    this.scenicPreOrderInfo = info;
  }),
  setHotelPreOrderInfo: action(function (info) {
    this.hotelPreOrderInfo = info;
  }),
  setMediaProductList: action(function (list) {
    this.mediaProductList = list;
  }),
  setOrderTotal: action(function (list) {
    this.orderTotal = list;
  }),
  setScenicOrderTotal: action(function (list) {
    this.scenicOrderTotal = list;
  }),
  setHotelOrderTotal: action(function (list) {
    this.hotelOrderTotal = list;
  }),
  setSetMealOrderTotal: action(function (list) {
    this.setMealOrderTotal = list;
  }),
  setMealTicketOrderTotal: action(function (list) {
    this.mealTicketOrderTotal = list;
  }),
  setGoodsOrderTotal: action(function (list) {
    this.goodsOrderTotal = list;
  }),

  ...tim,
  ...live,
  ...hotel
});
