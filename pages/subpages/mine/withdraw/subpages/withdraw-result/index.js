import { WEBVIEW_BASE_URL } from "../../../../../../config";
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
        scenicShopOptions = [],
        hotelShopOptions = [],
        cateringShopOptions = [],
        goodsShopOptions = []
      } = store.merchantInfo || {};
      const merchantType = this.scene - 3;
      const { id } = [
        scenicShopOptions,
        hotelShopOptions,
        cateringShopOptions,
        goodsShopOptions
      ][merchantType - 1][0];
      wx.navigateTo({
        url: `${baseUrl}/income&merchant_type=${merchantType}&shop_id=${id}`
      });
    } else {
      wx.navigateTo({
        url: `${baseUrl}/reward`
      });
    }
  }
});
