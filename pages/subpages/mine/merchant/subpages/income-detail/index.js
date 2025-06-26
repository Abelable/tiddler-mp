import { WEBVIEW_BASE_URL } from "../../../../../../config";
import MerchantService from "../../utils/merchantService";

const merchantService = new MerchantService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    incomeSum: null,
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

  onLoad({ merchantType, shopId = 0 }) {
    this.merchantType = +merchantType;
    this.shopId = +shopId;
  },

  onShow() {
    this.setIncomeSum();
    this.setTimeData();
    this.setOrderList(true);
  },

  selectDate(e) {
    const curDateIdx = e.currentTarget.dataset.index;
    this.setData({ curDateIdx });
    this.setTimeData();
    this.setOrderList(true);
  },

  onReachBottom() {
    this.setOrderList();
  },

  onPullDownRefresh() {
    this.setOrderList(true);
    wx.stopPullDownRefresh();
  },

  setIncomeSum() {
    switch (this.merchantType) {
      case 4:
        this.setShopIncomeSum();
        break;
    }
  },

  setTimeData() {
    switch (this.merchantType) {
      case 4:
        this.setShopTimeData();
        break;
    }
  },

  setOrderList(init = false) {
    switch (this.merchantType) {
      case 4:
        this.setShopOrderList(init);
        break;
    }
  },

  async setShopIncomeSum() {
    const incomeSum = await merchantService.getShopIncomeSum(this.shopId);
    this.setData({ incomeSum });
  },

  async setShopTimeData() {
    const { dateList, curDateIdx } = this.data;
    const timeData = await merchantService.getShopTimeData(
      this.shopId,
      dateList[curDateIdx].value,
    );
    this.setData({ timeData });
  },

  async setOrderList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    const { dateList, curDateIdx, orderList } = this.data;
    const list = await merchantService.getShopIncomeOrderList({
      shopId: this.shopId,
      timeType: dateList[curDateIdx].value,
      statusList: [1, 2, 3, 4],
      page: ++this.page
    });
    this.setData({ orderList: init ? list : [...orderList, ...list] });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  checkOrderDetail(e) {
    const { id, scene } = e.currentTarget.dataset;
    if (scene === 1) {
      const url = `/pages/subpages/mine/order/subpages/goods-order/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  },

  withdraw(e) {
    const { scene } = e.currentTarget.dataset;
    const { selfPurchase, share, team } = this.data.cashInfo || {};
    const amount = [selfPurchase, share, team][scene - 1];
    wx.navigateTo({
      url: `/pages/subpages/mine/withdraw/index?scene=${scene}&amount=${amount}`
    });
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
      url: `/pages/subpages/mine/withdraw/index?scene=4&amount=${amount}`
    });
  },

  checkWithdrawRecord() {
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/promoter/withdraw_record`
    });
  }
});
