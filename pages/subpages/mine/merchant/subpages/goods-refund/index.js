import RefundService from "./utils/refundService";

const refundService = new RefundService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    menuList: [
      { name: "全部", status: undefined, total: 0 },
      { name: "待审核", status: 0, total: 0 },
      { name: "待确认", status: 2, total: 0 },
      { name: "已退款", status: 3, total: 0 },
      { name: "已驳回", status: 4, total: 0 }
    ],
    curMenuIndex: 0,
    refundList: [],
    finished: false
  },

  onLoad({ shopId }) {
    this.shopId = +shopId
  },

  onShow() {
    this.setShopRefundTotal();
    this.setRefundList(true);
  },

  selectMenu(e) {
    const { index: curMenuIndex } = e.currentTarget.dataset;
    this.setData({ curMenuIndex });
    this.setRefundList(true);
  },

  async setShopRefundTotal() {
    const orderTotal = await refundService.getShopRefundTotal(this.shopId);
    this.setData({
      ["menuList[1].total"]: orderTotal[0],
      ["menuList[2].total"]: orderTotal[1]
    });
  },

  async setRefundList(init = false) {
    const limit = 10;
    const { menuList, curMenuIndex, refundList } = this.data;
    if (init) this.page = 0;
    const list = await refundService.getRefundList({
      shopId: this.shopId,
      status: menuList[curMenuIndex].status,
      page: ++this.page,
      limit
    });
    this.setData({
      refundList: init ? list : [...refundList, ...list]
    });
    if (list.length < limit) {
      this.setData({ finished: true });
    }
  },

  onPullDownRefresh() {
    this.setRefundList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setRefundList();
  },

  updateOrderList(e) {
    const statusEmuns = {
      approve: 1,
      reject: 4,
      confirm: 3
    };
    const { type, index } = e.detail;
    const { curMenuIndex, refundList } = this.data;
    if (type === "delete" || curMenuIndex !== 0) {
      refundList.splice(index, 1);
      this.setData({ refundList });
    } else {
      this.setData({
        [`refundList[${index}].status`]: statusEmuns[type]
      });
    }
  },

  search() {
    wx.navigateTo({
      url: `./subpages/refund-search/index?shopId=${this.shopId}`
    });
  }
});
