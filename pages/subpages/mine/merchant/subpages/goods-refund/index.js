import RefundService from "./utils/refundService";

const refundService = new RefundService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    shopId: 0,
    menuList: [
      { name: "全部", status: undefined, total: 0 },
      { name: "待审核", status: 0, total: 0 },
      { name: "待确认", status: 2, total: 0 },
      { name: "已退款", status: 3, total: 0 },
      { name: "已驳回", status: 4, total: 0 }
    ],
    curMenuIndex: 0,
    orderSn: "",
    refundList: [],
    finished: false,
    refundId: 0,
    rejectModalVisible: false
  },

  onLoad({ shopId }) {
    this.setData({ shopId: +shopId });
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
    const orderTotal = await refundService.getShopRefundTotal(this.data.shopId);
    this.setData({
      ["menuList[1].total"]: orderTotal[0],
      ["menuList[2].total"]: orderTotal[1]
    });
  },

  setOrderSn(e) {
    this.setData({ orderSn: e.detail.value });
  },

  search() {
    this.setRefundList(true);
  },

  cancelSearch() {
    this.setData({ orderSn: "" });
    this.setRefundList(true);
  },

  async setRefundList(init = false) {
    const limit = 10;
    const { shopId, menuList, curMenuIndex, orderSn, refundList } = this.data;
    if (init) this.page = 0;
    const list = await refundService.getRefundList({
      shopId,
      status: menuList[curMenuIndex].status,
      orderSn,
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

  updateRefundList(e) {
    const { type, index } = e.detail;
    const statusEmuns = {
      approve: 1,
      reject: 4,
      confirm: 3
    };
    const { curMenuIndex, refundList } = this.data;
    if (curMenuIndex !== 0) {
      refundList.splice(index, 1);
      this.setData({ refundList });
    } else {
      this.setData({
        [`refundList[${index}].status`]: statusEmuns[type]
      });
    }
  },

  showRejectModal(e) {
    const { id: refundId } = e.detail;
    this.setData({
      refundId,
      rejectModalVisible: true
    });
  },

  rejected() {
    this.setRefundList(true);
    this.hideRejectModal();
  },

  hideRejectModal() {
    this.setData({
      refundId: 0,
      rejectModalVisible: false
    });
  },

  search() {
    wx.navigateTo({
      url: `./subpages/refund-search/index?shopId=${this.data.shopId}`
    });
  }
});
