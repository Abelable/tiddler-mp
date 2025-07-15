import { store } from "../../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    titleMenu: [],
    curTitleIdx: 0,
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
      cateringProviderId,
      shopId
    } = userInfo;

    const titleMenu = [];
    if (scenicShopId) {
      titleMenu.push({ name: "景区管理", type: "scenic", value: 1 });
    }
    if (hotelShopId) {
      titleMenu.push({ name: "酒店管理", type: "hotel", value: 2 });
    }
    if (cateringProviderId) {
      titleMenu.push({ name: "餐饮管理", type: "catering", value: 3 });
    }
    if (shopId) {
      titleMenu.push({ name: "电商管理", type: "goods", value: 4 });
    }

    const curTitleIdx = merchantType
      ? titleMenu.findIndex(item => item.value === merchantType)
      : 0;

    this.setData({ titleMenu, curTitleIdx });
  },

  selectTitle(e) {
    const curTitleIdx = +e.detail.value;
    this.setData({ curTitleIdx });
  },

  onUnload() {
    const { titleMenu, curTitleIdx } = this.data;
    const merchantType = titleMenu[curTitleIdx].value;
    store.setMerchantType(merchantType);
  }
});
