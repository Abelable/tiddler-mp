import { WEBVIEW_BASE_URL } from "../../../../../../config";

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    dateList: [
      { text: "今日", value: 1 },
      { text: "昨日", value: 2 },
      { text: "本月", value: 3 },
      { text: "上月", value: 4 },
      { text: "全部", value: 0 }
    ],
    curDateIdx: 0,
    timeData: null,
    orderList: [],
    finished: false
  },

  onLoad({ merchantType }) {
    this.merchantType = +merchantType;
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: true });
      }
    } else {
      if (this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: false });
      }
    }
  },

  withdraw() {
    // todo
    const amount = 100;
    wx.navigateTo({
      url: `./subpages/withdraw/index?scene=4&amount=${amount}`
    });
  },

  checkWithdrawRecord() {
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/promoter/withdraw_record`
    });
  }
});
