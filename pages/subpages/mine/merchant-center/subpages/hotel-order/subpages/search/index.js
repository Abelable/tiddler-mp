import HotelService from "../../utils/hotelService";

const hotelService = new HotelService();

Page({
  data: {
    historyKeywords: [],
    keywords: "",
    isSearching: false,
    orderList: [],
    finished: false
  },

  onLoad() {
    this.setHistoryKeywords();
  },

  setKeywords(e) {
    this.setData({
      keywords: e.detail.value
    });
  },

  selectKeywords(e) {
    const { keywords } = e.currentTarget.dataset;
    this.setData({ keywords });
    this.search();
  },

  search() {
    const { keywords } = this.data;
    if (!keywords) {
      return;
    }
    hotelService.saveKeywords(keywords);
    this.setOrderList();
    this.setData({ isSearching: true });
  },

  cancelSearch() {
    this.setHistoryKeywords();
    this.setData({
      keywords: "",
      isSearching: false,
      orderList: [],
      finished: false
    });
  },

  async setOrderList() {
    const { keywords } = this.data;
    const orderList = (await hotelService.searchOrderList(keywords)) || [];
    this.setData({ orderList });
  },

  async setHistoryKeywords() {
    const historyKeywords = await hotelService.getHistoryKeywords();
    this.setData({ historyKeywords });
  },

  clearHistoryKeywords() {
    wx.showModal({
      content: "确定清空历史搜索记录吗？",
      showCancel: true,
      success: result => {
        if (result.confirm) {
          this.setData({
            historyKeywords: []
          });
          hotelService.clearHistoryKeywords();
        }
      }
    });
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
  }
});
