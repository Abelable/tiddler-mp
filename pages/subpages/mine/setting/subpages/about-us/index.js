import { WEBVIEW_BASE_URL } from "../../../../../../config";

Page({
  data: {
    protocolList: [
      {
        path: "user",
        name: "用户服务协议"
      },
      {
        path: "user_auth",
        name: "个人信息授权声明"
      },
      {
        path: "scenic_merchant",
        name: "景区服务商服务协议"
      },
      {
        path: "scenic_deposit",
        name: "景区服务商保证金协议"
      },
      {
        path: "hotel_merchant",
        name: "酒店服务商服务协议"
      },
      {
        path: "hotel_deposit",
        name: "酒店服务商保证金协议"
      },
      {
        path: "hotel_order",
        name: "酒店预订条款"
      },
      {
        path: "catering_merchant",
        name: "餐饮商家服务协议"
      },
      {
        path: "catering_deposit",
        name: "餐饮商家保证金协议"
      },
      {
        path: "merchant",
        name: "电商商家服务协议"
      },
      {
        path: "deposit",
        name: "电商商家保证金协议"
      },
      {
        path: "withdraw",
        name: "提现规则"
      }
    ]
  },

  checkLicense() {
    wx.navigateTo({
      url: "../license/index"
    });
  },

  checkProtocol(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/protocol/${path}`
    });
  }
});
