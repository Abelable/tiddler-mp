import { store } from "../../../../../../store/index";
import GoodsOrderService from "./utils/goodsOrderService";

const goodsOrderService = new GoodsOrderService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    menuList: [
      { name: "全部", status: 0, total: 0 },
      { name: "待发货", status: 1, total: 0 },
      { name: "待收货", status: 2, total: 0 },
      { name: "待使用", status: 3, total: 0 },
      { name: "已评价", status: 4, total: 0 },
      { name: "售后", status: 5, total: 0 }
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
    const { shopId } = store.userInfo;
    const orderTotal = await goodsOrderService.getShopOrderTotal(shopId);
    this.setData({
      ["menuList[1].total"]: orderTotal[0],
      ["menuList[2].total"]: orderTotal[1],
      ["menuList[3].total"]: orderTotal[2],
      ["menuList[5].total"]: orderTotal[4]
    });
  },

  async setOrderList(init = false) {
    const limit = 10;
    const { shopId } = store.userInfo;
    const { menuList, curMenuIndex, orderList } = this.data;
    if (init) this.page = 0;
    const list = await goodsOrderService.getOrderList({
      shopId,
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
      refund: 204,
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
   const { shopId } = store.userInfo;
    wx.navigateTo({
      url: `../order-search/index?shopId=${shopId}&type=5`
    });
  }
});
