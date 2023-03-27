import { WEBVIEW_BASE_URL } from "../../../../config"

Page({
  data: {
  },

  navToSettleIn() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/merchant/settle_in`
    wx.navigateTo({ url })
  },
})
