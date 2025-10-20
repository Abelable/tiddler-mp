import { WEBVIEW_BASE_URL } from "../../../../../../config";
import { store } from "../../../../../../store/index";
import IncomeService from "./utils/incomeService";

const incomeService = new IncomeService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    merchantType: 0,
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
    this.setData({ merchantType: +merchantType });
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
    switch (this.data.merchantType) {
      case 1:
        this.setScenicShopIncomeSum();
        break;
      case 2:
        this.setHotelShopIncomeSum();
        break;
      case 3:
        this.setCateringShopIncomeSum();
        break;
      case 4:
        this.setShopIncomeSum();
        break;
    }
  },

  setTimeData() {
    switch (this.data.merchantType) {
      case 1:
        this.setScenicShopTimeData();
        break;
      case 2:
        this.setHotelShopTimeData();
        break;
      case 3:
        this.setCateringShopTimeData();
        break;
      case 4:
        this.setShopTimeData();
        break;
    }
  },

  setOrderList(init = false) {
    switch (this.data.merchantType) {
      case 1:
        this.setScenicShopOrderList(init);
        break;
      case 2:
        this.setHotelShopOrderList(init);
        break;
      case 3:
        this.setCateringShopOrderList(init);
        break;
      case 4:
        this.setShopOrderList(init);
        break;
    }
  },

  async setScenicShopIncomeSum() {
    const { scenicShopId } = store.userInfo;
    const incomeSum = await incomeService.getScenicShopIncomeSum(scenicShopId);
    this.setData({ incomeSum });
  },

  async setScenicShopTimeData() {
    const { scenicShopId } = store.userInfo;
    const { dateList, curDateIdx } = this.data;
    const timeData = await incomeService.getScenicShopTimeData(
      scenicShopId,
      dateList[curDateIdx].value
    );
    this.setData({ timeData });
  },

  async setScenicShopOrderList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ orderList: [], finished: false });
    }

    const { scenicShopId: shopId } = store.userInfo;
    const { dateList, curDateIdx } = this.data;
    const page = ++this.page;

    const list = await incomeService.getScenicShopIncomeOrderList({
      shopId,
      timeType: dateList[curDateIdx].value,
      statusList: [1, 2, 3, 4],
      page
    });

    this.setData({
      orderList: init ? list : [...this.data.orderList, ...list]
    });

    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  async setHotelShopIncomeSum() {
    const { hotelShopId } = store.userInfo;
    const incomeSum = await incomeService.getHotelShopIncomeSum(hotelShopId);
    this.setData({ incomeSum });
  },

  async setHotelShopTimeData() {
    const { hotelShopId } = store.userInfo;
    const { dateList, curDateIdx } = this.data;
    const timeData = await incomeService.getHotelShopTimeData(
      hotelShopId,
      dateList[curDateIdx].value
    );
    this.setData({ timeData });
  },

  async setHotelShopOrderList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ orderList: [], finished: false });
    }

    const { hotelShopId: shopId } = store.userInfo;
    const { dateList, curDateIdx } = this.data;
    const page = ++this.page;

    const list = await incomeService.getHotelShopIncomeOrderList({
      shopId,
      timeType: dateList[curDateIdx].value,
      statusList: [1, 2, 3, 4],
      page
    });

    this.setData({
      orderList: init ? list : [...this.data.orderList, ...list]
    });

    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  async setCateringShopIncomeSum() {
    const { cateringShopId } = store.userInfo;
    const incomeSum = await incomeService.getCateringShopIncomeSum(
      cateringShopId
    );
    this.setData({ incomeSum });
  },

  async setCateringShopTimeData() {
    const { cateringShopId } = store.userInfo;
    const { dateList, curDateIdx } = this.data;
    const timeData = await incomeService.getCateringShopTimeData(
      cateringShopId,
      dateList[curDateIdx].value
    );
    this.setData({ timeData });
  },

  async setCateringShopOrderList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ orderList: [], finished: false });
    }

    const { cateringShopId: shopId } = store.userInfo;
    const { dateList, curDateIdx } = this.data;
    const page = ++this.page;

    const list = await incomeService.getCateringShopIncomeOrderList({
      shopId,
      timeType: dateList[curDateIdx].value,
      statusList: [1, 2, 3, 4],
      page
    });

    this.setData({
      orderList: init ? list : [...this.data.orderList, ...list]
    });

    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  async setShopIncomeSum() {
    const { shopId } = store.userInfo;
    const incomeSum = await incomeService.getShopIncomeSum(shopId);
    this.setData({ incomeSum });
  },

  async setShopTimeData() {
    const { shopId } = store.userInfo;
    const { dateList, curDateIdx } = this.data;
    const timeData = await incomeService.getShopTimeData(
      shopId,
      dateList[curDateIdx].value
    );
    this.setData({ timeData });
  },

  async setShopOrderList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ orderList: [], finished: false });
    }

    const { shopId } = store.userInfo;
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
        this.data.merchantType + 3
      }&amount=${cashAmount}`
    });
  },

  checkWithdrawRecord() {
    const {
      scenicShopId,
      hotelShopId,
      cateringShopId,
      shopId: goodsShopId
    } = store.userInfo;
    const { merchantType } = this.data;
    const shopId = [scenicShopId, hotelShopId, cateringShopId, goodsShopId][
      merchantType - 1
    ];
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/withdrawal_record/income&merchant_type=${merchantType}&shop_id=${shopId}`
    });
  }
});
