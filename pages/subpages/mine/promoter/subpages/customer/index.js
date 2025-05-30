import PromoterService from "../../utils/promoterService";

const promoterService = new PromoterService();

Page({
  data: {
    curMenuIdx: 0,
    keywords: "",
    searching: false,
    customerList: [],
    finished: false
  },

  onLoad(options) {
    const type = +options.type;
    if (type !== 0) {
      this.setData({ curMenuIdx: type - 1 });
    }
    this.setCustomerList(true);
  },

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curMenuIdx });
    this.setCustomerList(true);
  },

  setKeywords(e) {
    this.setData({
      keywords: e.detail.value
    });
  },

  search() {
    if (!this.data.keywords) {
      wx.showToast({
        title: "请输入昵称或手机号",
        icon: "none"
      });
      return;
    }
    this.setData({ searching: true });
    this.setCustomerList(true);
  },

  clearSearch() {
    this.setData({ searching: false, keywords: "" });
    this.setCustomerList(true);
  },

  onPullDownRefresh() {
    this.setCustomerList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    if (this.data.curMenuIdx === 2) {
      this.setCustomerList();
    }
  },

  async setCustomerList(init = false) {
    const { searching, curMenuIdx, keywords, customerList } = this.data;
    if (init) {
      this.page = 0;
    }
    let list = [];
    if (searching || curMenuIdx === 2) {
      list = await promoterService.getCustomerList({
        keywords,
        page: ++this.page
      });
    } else if (curMenuIdx === 0) {
      list = await promoterService.getTodayNewCustomerList();
    } else {
      list = await promoterService.getTodayOrderingCustomerList();
    }

    this.setData({ customerList: init ? list : [...customerList, ...list] });
    if (!list.length) {
      this.setData({ finished: true });
    }
  }
});
