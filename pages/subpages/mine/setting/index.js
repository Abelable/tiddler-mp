import { WEBVIEW_BASE_URL } from "../../../../config";

Page({
  data: {
    toolVisible: false // todo 用于前期提交审核隐藏部分功能，后期需要删除
  },

  onLoad() {
    // todo 用于前期提交审核隐藏部分功能，后期需要删除
    const { envVersion } = wx.getAccountInfoSync().miniProgram || {};
    if (envVersion === "release") {
      this.setData({ toolVisible: true });
    }
  },

  editUserInfo() {
    wx.navigateTo({
      url: "./subpages/user-info-setting/index"
    });
  },

  navToAuth() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/auth`;
    wx.navigateTo({ url });
  },

  navToScenicMerchantSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/scenic/merchant/settle_in`;
    wx.navigateTo({ url });
  },

  navToHotelProviderSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/hotel/merchant/settle_in`;
    wx.navigateTo({ url });
  },

  navToCateringSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/catering/merchant/settle_in`;
    wx.navigateTo({ url });
  },

  navToMerchantSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/goods/merchant/settle_in`;
    wx.navigateTo({ url });
  }
});
