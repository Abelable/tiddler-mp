import OrderService from "../../utils/orderService";

const orderService = new OrderService();

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
    orderService.saveKeywords(keywords);
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

  async setOrderList() {
    const { type, keywords } = this.data;
    let orderList;
    switch (type) {
      case 1:
        orderList = (await orderService.searchScenicOrderList(keywords)) || [];
        break;
      case 2:
        orderList = (await orderService.searchHotelOrderList(keywords)) || [];
        break;
      case 3:
        orderList = (await orderService.searchMealTicketOrderList(keywords)) || [];
        break;
      case 4:
        orderList = (await orderService.searchSetMealOrderList(keywords)) || [];
        break;
      case 5:
        orderList = (await orderService.searchGoodsOrderList(keywords)) || [];
        break;
    }
    this.setData({ orderList });
  },

  async setHistoryKeywords() {
    let historyKeywords;
    switch (this.data.type) {
      case 1:
        historyKeywords = await orderService.getScenicHistoryKeywords();
        break;
      case 2:
        historyKeywords = await orderService.getHotelHistoryKeywords();
        break;
      case 3:
        historyKeywords = await orderService.getMealTicketHistoryKeywords();
        break;
      case 4:
        historyKeywords = await orderService.getSetMealHistoryKeywords();
        break;
      case 5:
        historyKeywords = await orderService.getGoodsHistoryKeywords();
        break;
    }
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
          switch (this.data.type) {
            case 1:
              orderService.clearScenicHistoryKeywords();
              break;
            case 2:
              orderService.clearHotelHistoryKeywords();
              break;
            case 3:
              orderService.clearMealTicketHistoryKeywords();
              break;
            case 4:
              orderService.clearSetMealHistoryKeywords();
              break;
            case 5:
              orderService.clearGoodsHistoryKeywords();
              break;
          }
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
  },
});
