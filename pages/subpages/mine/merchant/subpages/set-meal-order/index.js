import CateringService from "../utils/cateringService";

const cateringService = new CateringService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    menuList: [
      { name: "全部", status: 0 },
      { name: "待付款", status: 1 },
      { name: "待使用", status: 2 },
      { name: "售后", status: 4 }
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
    this.setOrderList(true);
  },

  selectMenu(e) {
    const { index: curMenuIndex } = e.currentTarget.dataset;
    this.setData({ curMenuIndex });
    this.setOrderList(true);
  },

  async setOrderList(init = false) {
    const limit = 10;
    const { menuList, curMenuIndex, orderList } = this.data;
    if (init) this.page = 0;
    const list = await cateringService.getSetMealOrderList({
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
