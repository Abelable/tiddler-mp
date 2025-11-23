import SearchService from "../../utils/orderService";

const searchService = new SearchService();

Page({
  data: {
    shopId: 0,
    historyKeywords: [],
    keywords: "",
    isSearching: false,
    orderList: [],
    verifyCode: ""
  },

  onLoad({ shopId }) {
    this.setData({ shopId: +shopId });
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
    const { shopId, type } = this.data;
    searchService.saveOrderKeywords(shopId, type, keywords);
  },

  async setOrderList() {
    const { shopId, type, keywords } = this.data;
    let orderList;
    switch (type) {
      case 1:
        orderList =
          (await searchService.searchScenicOrderList(shopId, keywords)) || [];
        break;
      case 2:
        orderList =
          (await searchService.searchHotelOrderList(shopId, keywords)) || [];
        break;
      case 3:
        orderList =
          (await searchService.searchMealTicketOrderList(shopId, keywords)) ||
          [];
        break;
      case 4:
        orderList =
          (await searchService.searchSetMealOrderList(shopId, keywords)) || [];
        break;
      case 5:
        orderList =
          (await searchService.searchGoodsOrderList(shopId, keywords)) || [];
        break;
    }
    this.setData({ orderList });
  },

  async setHistoryKeywords() {
    const { shopId, type } = this.data;
    const historyKeywords = await searchService.getOrderHistoryKeywords(
      shopId,
      type
    );
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

  updateOrderList(e) {
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
  }
});
