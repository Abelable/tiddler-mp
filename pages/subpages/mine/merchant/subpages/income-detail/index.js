import { WEBVIEW_BASE_URL } from "../../../../../../config";
import { store } from "../../../../../../store/index";
import IncomeService from "./utils/incomeService";

const incomeService = new IncomeService();
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

  onLoad({ merchantType }) {
    this.merchantType = +merchantType;
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
    const shopId = store.userInfo.shopId;
    const incomeSum = await incomeService.getShopIncomeSum(shopId);
    this.setData({ incomeSum });
  },

  async setShopTimeData() {
    const shopId = store.userInfo.shopId;
    const { dateList, curDateIdx } = this.data;
    const timeData = await incomeService.getShopTimeData(
      shopId,
      dateList[curDateIdx].value
    );
    this.setData({ timeData });
  },

  async setOrderList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ orderList: [], finished: false });
    }

    const shopId = store.userInfo.shopId;
    const { dateList, curDateIdx } = this.data;
    const page = ++this.page;

    const incomeList = await incomeService.getShopIncomeOrderList({
      shopId,
      timeType: dateList[curDateIdx].value,
      statusList: [1, 2, 3, 4],
      page
    });

    const orderMap = new Map();
    const orderList = [...this.data.orderList];
    orderList.forEach(order => orderMap.set(order.orderId, order));

    for (const item of incomeList) {
      const { orderId, goodsInfo, incomeAmount, ...rest } = item;

      const goods = { ...goodsInfo, incomeAmount };
      const existingOrder = orderMap.get(orderId);
      
      if (existingOrder) {
        existingOrder.incomeAmount += incomeAmount;
        existingOrder.goodsList.push(goods);
      } else {
        const newOrder = {
          ...rest,
          orderId,
          incomeAmount,
          goodsList: [goods]
        };
        orderList.push(newOrder);
        orderMap.set(orderId, newOrder);
      }
    }

    this.setData({
      orderList,
      finished: incomeList.length === 0
    });
  },

  checkOrderDetail(e) {
    const { id, scene } = e.currentTarget.dataset;
    if (scene === 1) {
      const url = `/pages/subpages/mine/order/subpages/goods-order/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
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
    const { cashAmount } = this.data.incomeSum;
    wx.navigateTo({
      url: `/pages/subpages/mine/withdraw/index?scene=${
        this.merchantType + 3
      }&amount=${cashAmount}`
    });
  },

  checkWithdrawRecord() {
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/withdrawal_record`
    });
  }
});
