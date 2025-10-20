import { store } from "../../../../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight
  },

  onLoad(options) {
    this.scene = Number(options.scene);
  },

  navigateBack() {
    wx.navigateBack({ delta: 2 });
  },

  checkRecord() {
    const baseUrl = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/withdrawal_record`;
    if (this.scene <= 3) {
      wx.navigateTo({
        url: `${baseUrl}/commission`
      });
    } else if (this.scene > 3 && this.scene <= 7) {
      const {
        scenicShopId,
        hotelShopId,
        cateringShopId,
        shopId: goodsShopId
      } = store.userInfo;
      const merchantType = this.scene - 3;
      const shopId = [scenicShopId, hotelShopId, cateringShopId, goodsShopId][
        merchantType - 1
      ];
      wx.navigateTo({
        url: `${baseUrl}/income&merchant_type=${merchantType}&shop_id=${shopId}`
      });
    } else {
      wx.navigateTo({
        url: `${baseUrl}/reward`
      });
    }
  }
});
