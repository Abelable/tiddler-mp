import { store } from "../../../../../../store/index";
import MealTicketOrderService from "./utils/mealTicketOrderService";

const mealTicketOrderService = new MealTicketOrderService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    menuList: [
      { name: "全部", status: 0, total: 0 },
      { name: "待确认", status: 1, total: 0 },
      { name: "待使用", status: 2, total: 0 },
      { name: "已评价", status: 3, total: 0 },
      { name: "售后", status: 4, total: 0 }
    ],
    curMenuIndex: 0,
    orderList: [],
    finished: false
  },

  onLoad({ status = "0" }) {
    const curMenuIndex = this.data.menuList.findIndex(
      item => item.status === Number(status)
    );
    this.setData({ curMenuIndex });
  },

  onShow() {
    this.setShopOrderTotal();
    this.setOrderList(true);
  },

  selectMenu(e) {
    const { index: curMenuIndex } = e.currentTarget.dataset;
    this.setData({ curMenuIndex });
    this.setOrderList(true);
  },

    async setShopOrderTotal() {
      const { cateringShopId } = store.userInfo;
      const orderTotal = await mealTicketOrderService.getShopMealTicketOrderTotal(
        cateringShopId
      );
      this.setData({
        ["menuList[1].total"]: orderTotal[0],
        ["menuList[2].total"]: orderTotal[1],
        ["menuList[4].total"]: orderTotal[3]
      });
    },

  async setOrderList(init = false) {
    const limit = 10;
    const { menuList, curMenuIndex, orderList } = this.data;
    if (init) this.page = 0;
    const list = await mealTicketOrderService.getMealTicketOrderList({
      status: menuList[curMenuIndex].status,
      page: ++this.page,
      limit
    });
    this.setData({
      orderList: init ? list : [...orderList, ...list]
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

  updateOrderList(e) {
    const statusEmuns = {
      cancel: 102,
      pay: 201,
      refund: 203,
      confirm: 401
    };
    const { type, index } = e.detail;
    const { curMenuIndex, orderList } = this.data;
    if (type === "delete" || curMenuIndex !== 0) {
      orderList.splice(index, 1);
      this.setData({ orderList });
    } else {
      this.setData({
        [`orderList[${index}].status`]: statusEmuns[type]
      });
    }
  },

  search() {
    wx.navigateTo({
      url: "./subpages/search/index"
    });
  }
});
