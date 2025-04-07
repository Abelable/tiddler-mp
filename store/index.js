import { configure, observable, action } from "mobx-miniprogram";
import tim from "./modules/tim";
import live from "./modules/live/index";
import hotel from "./modules/hotel";

configure({ enforceActions: "observed" }); // 不允许在动作外部修改状态

export const store = observable({
  tabType: "home",
  userInfo: null,
  promoterInfo: null,
  activeMediaItem: null,
  croppedImagePath: "",
  locationInfo: null,
  scenicPreOrderInfo: null,
  hotelPreOrderInfo: null,
  mediaCommodityList: [],

  setTabType: action(function (type) {
    this.tabType = type;
  }),
  setUserInfo: action(function (info) {
    this.userInfo = info;
  }),
  setPromoterInfo: action(function (info) {
    this.promoterInfo = info;
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
  setMediaCommodityList: action(function (list) {
    this.mediaCommodityList = list;
  }),

  ...tim,
  ...live,
  ...hotel
});
