import OrderService from "./utils/orderService";

const orderService = new OrderService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    shopId: 0,
    menuList: [
      { name: "全部", status: 0, total: 0 },
      { name: "待发货", status: 1, total: 0 },
      { name: "待收货", status: 2, total: 0 },
      { name: "待自提", status: 3, total: 0 },
      { name: "已评价", status: 4, total: 0 }
    ],
    curMenuIndex: 0,
    orderList: [],
    finished: false
  },

  onLoad({ shopId, status = "0" }) {
    this.setData({ shopId: +shopId });

    const curMenuIndex = this.data.menuList.findIndex(
      item => item.status === Number(status)
    );
    this.setData({ curMenuIndex });
  },

  onShow() {
    this.init();
  },

  init() {
    this.setShopOrderTotal();
    this.setOrderList(true);
  },

  selectMenu(e) {
    const { index: curMenuIndex } = e.currentTarget.dataset;
    this.setData({ curMenuIndex });
    this.setOrderList(true);
  },

  async setShopOrderTotal() {
    const orderTotal = await orderService.getShopOrderTotal(this.data.shopId);
    this.setData({
      ["menuList[1].total"]: orderTotal[0],
      ["menuList[2].total"]: orderTotal[1],
      ["menuList[3].total"]: orderTotal[2]
    });
  },

  async setOrderList(init = false) {
    const limit = 10;
    const { shopId, menuList, curMenuIndex, orderList } = this.data;
    if (init) this.page = 0;
    const list = await orderService.getOrderList({
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

  updateOrderList() {
    this.init();
  },

  search() {
    wx.navigateTo({
      url: `./subpages/order-search/index?shopId=${this.data.shopId}`
    });
  }
});
