import { store } from "../../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    merchantList: [],
    curMerchantIdx: 0,
    shopIncomeOverview: null,
    shopOrderTotal: null
  },

  onLoad() {
    this.setTitleMenu();
  },

  async setTitleMenu() {
    const { merchantType, userInfo } = store;
    const {
      scenicShopId,
      hotelShopId,
      cateringShopId,
      shopId
    } = userInfo;

    const merchantList = [];
    if (scenicShopId) {
      merchantList.push({ name: "景区管理", type: "scenic", value: 1 });
    }
    if (hotelShopId) {
      merchantList.push({ name: "酒店管理", type: "hotel", value: 2 });
    }
    if (cateringShopId) {
      merchantList.push({ name: "餐饮管理", type: "catering", value: 3 });
    }
    if (shopId) {
      merchantList.push({ name: "电商管理", type: "goods", value: 4 });
    }

    const curMerchantIdx = merchantType
      ? merchantList.findIndex(item => item.value === merchantType)
      : 0;

    this.setData({ merchantList, curMerchantIdx });
  },

  selectTitle(e) {
    const curMerchantIdx = e.detail.current;
    this.setData({ curMerchantIdx });
  },

  onUnload() {
    const { merchantList, curMerchantIdx } = this.data;
    const merchantType = merchantList[curMerchantIdx].value;
    store.setMerchantType(merchantType);
  }
});
