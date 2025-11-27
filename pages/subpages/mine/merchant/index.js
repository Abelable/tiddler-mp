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
      scenicShopOptions = [],
      hotelShopOptions = [],
      cateringShopOptions = [],
      goodsShopOptions = []
    } = userInfo;

    const merchantList = [];

    if (scenicShopOptions.length) {
      const shopOptions = scenicShopOptions.filter(item =>
        [0, 1, 2].includes(item.roleId)
      );
      merchantList.push({ name: "景区管理", type: "scenic", shopOptions });
    }
    if (hotelShopOptions.length) {
      const shopOptions = hotelShopOptions.filter(item =>
        [0, 1, 2].includes(item.roleId)
      );
      merchantList.push({ name: "酒店管理", type: "hotel", shopOptions });
    }
    if (cateringShopOptions.length) {
      const shopOptions = cateringShopOptions.filter(item =>
        [0, 1, 2].includes(item.roleId)
      );
      merchantList.push({ name: "餐饮管理", type: "catering", shopOptions });
    }
    if (goodsShopOptions.length) {
      const shopOptions = goodsShopOptions.filter(item =>
        [0, 1, 2].includes(item.roleId)
      );
      merchantList.push({ name: "电商管理", type: "goods", shopOptions });
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
