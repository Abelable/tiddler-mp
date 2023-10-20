import { WEBVIEW_BASE_URL } from "../../../../config";

Page({
  navToAuth() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/auth`;
    wx.navigateTo({ url });
  },

  navToScenicProviderSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/scenic/provider/settle_in`;
    wx.navigateTo({ url });
  },

  navToHotelProviderSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/hotel/provider/settle_in`;
    wx.navigateTo({ url });
  },

  navToCateringSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/catering/provider/settle_in`;
    wx.navigateTo({ url });
  },

  navToMerchantSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/merchant/settle_in`;
    wx.navigateTo({ url });
  },
});
