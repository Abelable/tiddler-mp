import { customBack, debounce } from "../../../../utils/index";
import MallService from "../utils/mallService";

const mallService = new MallService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    historyKeywordsList: [],
    keywords: "",
    isSearching: false,
    curMenuIdx: 0,
    scenicList: [],
    scenicFinished: false,
    hotelList: [],
    hotelFinished: false,
    restaurantList: [],
    restaurantFinished: false,
    goodsList: [],
    goodsFinished: false,
  },

  onLoad() {
    if (wx.getStorageSync("mallKeywordsList")) {
      this.setData({
        historyKeywordsList: JSON.parse(wx.getStorageSync("mallKeywordsList")),
      });
    }
  },

  setKeywords: debounce(function (e) {
    this.setData({
      keywords: e.detail.value,
    });
  }, 500),

  cancelSearch() {
    this.setData({
      keywords: "",
      isSearching: false,
      scenicList: [],
      scenicFinished: false,
      hotelList: [],
      hotelFinished: false,
      restaurantList: [],
      restaurantFinished: false,
      goodsList: [],
      goodsFinished: false,
    });
  },

  selectKeywords(e) {
    const { keywords } = e.currentTarget.dataset;
    this.setData({
      keywords,
      isSearching: true,
    });
    this.setList(true);
  },

  search() {
    const { keywords, isSearching, historyKeywordsList } = this.data;
    if (!keywords) {
      return;
    }
    this.setData({
      historyKeywordsList: Array.from(
        new Set([...historyKeywordsList, keywords])
      ),
    });
    if (!isSearching) {
      this.setData({ isSearching: true });
    }
    this.setList(true);
  },

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curMenuIdx });
    const { scenicList, hotelList, restaurantList, goodsList } = this.data;
    if (
      (curMenuIdx === 0 && !scenicList.length) ||
      (curMenuIdx === 1 && !hotelList.length) ||
      (curMenuIdx === 2 && !restaurantList.length) ||
      (curMenuIdx === 3 && !goodsList.length)
    ) {
      this.setList(true);
    }
  },

  onReachBottom() {
    this.setList();
  },

  onPullDownRefresh() {
    this.setList(true);
    wx.stopPullDownRefresh();
  },

  setList(init = false) {
    switch (this.data.curMenuIdx) {
      case 0:
        this.setScenicList(init);
        break;

      case 1:
        this.setHotelList(init);
        break;

      case 2:
        this.setRestaurantList(init);
        break;

      case 3:
        this.setGoodsList(init);
        break;
    }
  },

  async setScenicList(init = false) {
    const limit = 10;
    if (init) {
      this.scenicPage = 0;
      this.setData({ scenicFinished: false });
    }
    const { keywords, scenicList } = this.data;
    const { list = [] } =
      (await mallService.searchScenicList(
        keywords,
        ++this.scenicPage,
        limit
      )) || {};
    this.setData({
      scenicList: init ? list : [...scenicList, ...list],
    });
    if (list.length < limit) {
      this.setData({ scenicFinished: true });
    }
  },

  async setHotelList(init = false) {
    const limit = 10;
    if (init) {
      this.hotelPage = 0;
      this.setData({ hotelFinished: false });
    }
    const { keywords, hotelList } = this.data;
    const { list = [] } =
      (await mallService.searchHotelList(keywords, ++this.hotelPage, limit)) ||
      {};
    this.setData({
      hotelList: init ? list : [...hotelList, ...list],
    });
    if (list.length < limit) {
      this.setData({ hotelFinished: true });
    }
  },

  async setRestaurantList(init = false) {
    const limit = 10;
    if (init) {
      this.restaurantPage = 0;
      this.setData({ restaurantFinished: false });
    }
    const { keywords, restaurantList } = this.data;
    const { list = [] } =
      (await mallService.searchRestaurantList(
        keywords,
        ++this.restaurantPage,
        limit
      )) || {};
    this.setData({
      restaurantList: init ? list : [...restaurantList, ...list],
    });
    if (list.length < limit) {
      this.setData({ restaurantFinished: true });
    }
  },

  async setGoodsList(init = false) {
    const limit = 10;
    if (init) {
      this.goodsPage = 0;
      this.setData({
        goodsFinished: false,
      });
    }
    const { keywords, goodsList } = this.data;
    const list =
      (await goodsService.seachGoodsList({
        keywords,
        page: ++this.goodsPage,
        limit,
      })) || [];
    this.setData({
      goodsList: init ? list : [...goodsList, ...list],
    });
    if (list.length < limit) {
      this.setData({
        goodsFinished: true,
      });
    }
  },

  clearHistoryKeywords() {
    wx.showModal({
      content: "确定清空历史搜索记录吗？",
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          this.setData({
            historyKeywordsList: [],
          });
          wx.removeStorage({ key: "mallKeywordsList" });
        }
      },
    });
  },

  navBack() {
    customBack();
  },

  onUnload() {
    wx.setStorage({
      key: "mallKeywordsList",
      data: JSON.stringify(this.data.historyKeywordsList),
    });
  },
});
