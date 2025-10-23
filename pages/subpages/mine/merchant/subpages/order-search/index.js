import SearchService from "./utils/searchService";

const searchService = new SearchService();

Page({
  data: {
    type: 1,
    historyKeywords: [],
    keywords: "",
    isSearching: false,
    orderList: [],
    verifyCode: "",
    qrCodeModalVisible: false
  },

  onLoad({ type = "1" }) {
    this.setData({ type: +type });

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
    this.saveKeywords(keywords);
    this.setOrderList();
    this.setData({ isSearching: true });
  },

  cancelSearch() {
    this.setHistoryKeywords();
    this.setData({
      keywords: "",
      isSearching: false,
      orderList: []
    });
  },

  saveKeywords(keywords) {
    const { type } = this.data;
    searchService.saveOrderKeywords(type, keywords);
  },

  async setOrderList() {
    const { type, keywords } = this.data;
    let orderList;
    switch (type) {
      case 1:
        orderList = (await searchService.searchScenicOrderList(keywords)) || [];
        break;
      case 2:
        orderList = (await searchService.searchHotelOrderList(keywords)) || [];
        break;
      case 3:
        orderList =
          (await searchService.searchMealTicketOrderList(keywords)) || [];
        break;
      case 4:
        orderList = (await searchService.searchSetMealOrderList(keywords)) || [];
        break;
      case 5:
        orderList = (await searchService.searchGoodsOrderList(keywords)) || [];
        break;
    }
    this.setData({ orderList });
  },

  async setHistoryKeywords() {
    const { type } = this.data;
    const historyKeywords = await searchService.getOrderHistoryKeywords(type);
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
          searchService.clearOrderHistoryKeywords(this.data.type);
        }
      }
    });
  },

  updateGoodsOrderList(e) {
    const statusEmuns = {
      cancel: 102,
      pay: 201,
      refund: 203,
      confirm: 401
    };
    const { type, index } = e.detail;
    const { menuList, orderList } = this.data;
    const { curSubMenuIdx } = menuList[4];
    if (type === "delete" || curSubMenuIdx !== 0) {
      orderList.splice(index, 1);
      this.setData({ orderList });
    } else {
      this.setData({
        [`orderList[${index}].status`]: statusEmuns[type]
      });
    }
  },

  showQRcodeModal(e) {
    const { verifyCode } = e.detail;
    this.setData({
      verifyCode,
      qrCodeModalVisible: true
    });
  },

  hideQRcodeModal() {
    this.setData({
      qrCodeModalVisible: false
    });
    this.setOrderList(true);
  }
});
