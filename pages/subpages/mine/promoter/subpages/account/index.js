import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../config";
import AccountService from "./utils/accountService";

const accountService = new AccountService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    cashInfo: null,
    curMenuIdx: 0,
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

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"]
    });
  },

  onShow() {
    this.setCashInfo();
    this.setTimeData();
    this.setOrderList(true);
  },

  async setCashInfo() {
    const cashInfo = await accountService.getCommissionCashInfo();
    this.setData({ cashInfo });
  },

  async setTimeData() {
    const { dateList, curDateIdx, curMenuIdx } = this.data;
    const timeData = await accountService.getCommissionTimeData(
      dateList[curDateIdx].value,
      curMenuIdx + 1
    );
    this.setData({ timeData });
  },

  selectMenu(e) {
    const curMenuIdx = e.currentTarget.dataset.index;
    this.setData({ curMenuIdx });
    this.setTimeData();
    this.setOrderList(true);
  },

  selectDate(e) {
    const curDateIdx = e.currentTarget.dataset.index;
    this.setData({ curDateIdx });
    this.setTimeData();
    this.setOrderList(true);
  },

  async setOrderList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }

    const { curMenuIdx, dateList, curDateIdx } = this.data;
    const commissionList = await accountService.getCommissionOrderList({
      scene: curMenuIdx + 1,
      timeType: dateList[curDateIdx].value,
      statusList: [1, 2, 3],
      page: ++this.page
    });

    const orderList = [...this.data.orderList];

    for (const item of commissionList) {
      const { orderId, productType, product, commissionAmount, ...rest } = item;
      const existingOrder = orderList.find(
        order => order.orderId === orderId && order.productType === productType
      );

      if (existingOrder) {
        existingOrder.commissionAmount += commissionAmount;
        existingOrder.productList.push({ ...product, commissionAmount });
      } else {
        orderList.push({
          ...rest,
          orderId,
          productType,
          commissionAmount,
          productList: [{ ...product, commissionAmount }]
        });
      }
    }

    this.setData({
      orderList,
      finished: commissionList.length === 0
    });
  },

  checkOrderDetail(e) {
    const { id, scene } = e.currentTarget.dataset;
    if (scene === 1) {
      const url = `/pages/mine/subpages/order/subpages/order-detail/index?id=${id}`;
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

  onReachBottom() {
    this.setOrderList();
  },

  onPullDownRefresh() {
    this.setOrderList(true);
    wx.stopPullDownRefresh();
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

  checkWithdrawRecord() {
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/promoter/withdrawal_record`
    });
  },

  checkWithdrawRules() {
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/agreements/withdraw_rules`
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
