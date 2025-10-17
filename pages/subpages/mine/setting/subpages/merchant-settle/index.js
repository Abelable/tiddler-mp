const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false,
    merchantTypeList: [
      { name: "景区服务商", icon: "scenic" },
      { name: "酒店服务商", icon: "hotel" },
      { name: "餐饮商家", icon: "catering" },
      { name: "电商商家", icon: "goods" }
    ],
    merchantType: 1,
    shopType: 1
  },

  onLoad() {},

  selectMerchantType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ merchantType: index + 1 });
  },

  selectShopType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ shopType: index + 1 });
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.headerVisible) {
        this.setData({ headerVisible: true });
      }
    } else {
      if (this.data.headerVisible) {
        this.setData({ headerVisible: false });
      }
    }
  }
});
