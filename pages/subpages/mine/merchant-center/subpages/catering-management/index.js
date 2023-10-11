import { WEBVIEW_BASE_URL } from "../../../../../../config";
import CateringService from "./utils/cateringService";

const cateringService = new CateringService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    menuFixed: false,
    menuList: [
      { name: "全部", status: 0 },
      { name: "待付款", status: 1 },
      { name: "待使用", status: 2 },
      { name: "售后", status: 4 },
    ],
    curMenuIndex: 0,
    orderType: 1,
    orderList: [],
    finished: false,
  },

  onLoad() {
    this.setMenuTop();
  },

  onShow() {
    this.setOrderList(true);
  },

  setMenuTop() {
    const query = wx.createSelectorQuery();
    query.select(".menu-wrap").boundingClientRect();
    query.exec((res) => {
      if (res[0] !== null) {
        this.menuTop = res[0].top - statusBarHeight - 44;
      }
    });
  },

  switchOrderType() {
    const orderType = this.data.orderType === 1 ? 2 : 1;
    this.setData({ orderType }, () => {
      this.setOrderList(true);
    });
  },

  selectMenu(e) {
    const { index: curMenuIndex } = e.currentTarget.dataset;
    this.setData({ curMenuIndex });
    this.setOrderList(true);
  },

  async setOrderList(init = false) {
    if (this.data.orderType === 1) {
      this.setMealTicketOrderList(init);
    } else {
      this.setSetMealOrderList(init);
    }
  },

  async setMealTicketOrderList(init = false) {
    const limit = 10;
    const { menuList, curMenuIndex, orderList } = this.data;
    if (init) this.page = 0;
    const list = await cateringService.getMealTicketOrderList({
      status: menuList[curMenuIndex].status,
      page: ++this.page,
      limit,
    });
    this.setData({
      orderList: init ? list : [...orderList, ...list],
    });
    if (list.length < limit) {
      this.setData({ finished: true });
    }
  },

  async setSetMealOrderList(init = false) {
    const limit = 10;
    const { menuList, curMenuIndex, orderList } = this.data;
    if (init) this.page = 0;
    const list = await cateringService.getSetMealOrderList({
      status: menuList[curMenuIndex].status,
      page: ++this.page,
      limit,
    });
    this.setData({
      orderList: init ? list : [...orderList, ...list],
    });
    if (list.length < limit) {
      this.setData({ finished: true });
    }
  },

  onPullDownRefresh() {
    this.setOrderList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setOrderList();
  },

  onPageScroll(e) {
    const { menuFixed } = this.data;
    if (e.scrollTop >= this.menuTop) {
      if (!menuFixed) this.setData({ menuFixed: true });
    } else {
      if (menuFixed) this.setData({ menuFixed: false });
    }
  },

  navToRestaurantManagement() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/catering/restaurant/list`;
    wx.navigateTo({ url });
  },

  navToMealTicketManagement() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/catering/meal_ticket/list`;
    wx.navigateTo({ url });
  },

  navToFreightTemplateManagement() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/freight_template/list`;
    wx.navigateTo({ url });
  },
});
