import { WEBVIEW_BASE_URL } from "../../../../config"

Page({
  data: {
  },

  navToScenicProviderSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/scenic/provider/settle_in`
    wx.navigateTo({ url })
  },

  navToMerchantSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/merchant/settle_in`
    wx.navigateTo({ url })
  },
})
