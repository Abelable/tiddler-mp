import { customBack } from "../../../../utils/index";
import BaseService from "../../../../services/baseService";

const baseService = new BaseService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    historyKeywords: [],
    hotKeywords: [],
    keywords: "",
    isSearching: false,
    tabScroll: 0,
    curMenuIdx: 0,
    videoList: [],
    videoFinished: false,
    noteList: [],
    noteFinished: false,
    liveList: [],
    liveFinished: false,
    scenicList: [],
    scenicFinished: false,
    hotelList: [],
    hotelFinished: false,
    restaurantList: [],
    restaurantFinished: false,
    curGoodsSortIndex: 0,
    goodsSortOptions: [
      { icon: "", text: "综合排序", value: 0 },
      { icon: "", text: "销量排序", value: 1 },
      { icon: "", text: "价格降序", value: 2 },
      { icon: "", text: "价格升序", value: 3 }
    ],
    curGoodsCategoryId: 0,
    goodsCategoryOptions: [],
    goodsList: [],
    goodsFinished: false
  },

  onLoad({ scene = 0 }) {
    this.setData({ curMenuIdx: Number(scene) });
    this.setGoodsCategoryOptions();
    this.setHistoryKeywords();
    this.setHotKeywords();
  },

  setKeywords(e) {
    this.setData({
      keywords: e.detail.value
    });
  },

  cancelSearch() {
    this.setHistoryKeywords();
    this.setData({
      keywords: "",
      isSearching: false,
      videoList: [],
      videoFinished: false,
      noteList: [],
      noteFinished: false,
      liveList: [],
      liveFinished: false,
      curGoodsSortIndex: 0,
      curGoodsCategoryId: 0,
      goodsList: [],
      goodsFinished: false
    });
  },

  selectKeywords(e) {
    const { keywords } = e.currentTarget.dataset;
    this.setData({
      keywords,
      isSearching: true
    });
    this.setList(true);
  },

  search() {
    const { keywords, isSearching, historyKeywords } = this.data;
    if (!keywords) {
      return;
    }
    this.setData({
      historyKeywords: Array.from(new Set([...historyKeywords, keywords]))
    });
    if (!isSearching) {
      this.setData({ isSearching: true });
    }
    this.setList(true);
  },

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    const tabScroll = (curMenuIdx - 2) * 80;
    this.setData({ curMenuIdx, tabScroll });
    const { videoList, noteList, liveList, goodsList } = this.data;

    if (
      (curMenuIdx === 0 && !videoList.length) ||
      (curMenuIdx === 1 && !noteList.length) ||
      (curMenuIdx === 2 && !liveList.length) ||
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
        break;
        
      case 1:
        this.setVideoList(init);
        break;

      case 2:
        this.setNoteList(init);
        break;

      case 3:
        this.setLiveList(init);
        break;

      case 4:
        this.setScenicList(init);
        break;

      case 5:
        this.setHotelList(init);
        break;

      case 6:
        this.setRestaurantList(init);
        break;

      case 7:
        this.setGoodsList(init);
        break;

      case 8:
        break;
    }
  },

  async setVideoList(init = false) {
    const limit = 10;
    if (init) {
      this.videoPage = 0;
      this.setData({ videoFinished: false });
    }
    const { keywords, videoList } = this.data;
    const { list = [] } =
      (await baseService.searchVideoList(keywords, ++this.videoPage, limit)) ||
      {};
    this.setData({
      videoList: init ? list : [...videoList, ...list]
    });
    if (list.length < limit) {
      this.setData({ videoFinished: true });
    }
  },

  async setNoteList(init = false) {
    const limit = 10;
    if (init) {
      this.notePage = 0;
      this.setData({ noteFinished: false });
    }
    const { keywords, noteList } = this.data;
    const { list = [] } =
      (await baseService.searchNoteList(keywords, ++this.notePage, limit)) ||
      {};
    this.setData({
      noteList: init ? list : [...noteList, ...list]
    });
    if (list.length < limit) {
      this.setData({ noteFinished: true });
    }
  },

  async setLiveList(init = false) {
    const limit = 10;
    if (init) {
      this.livePage = 0;
      this.setData({ liveFinished: false });
    }
    const { keywords, liveList } = this.data;
    const { list = [] } =
      (await baseService.searchLiveRoomList(
        keywords,
        ++this.livePage,
        limit
      )) || {};
    this.setData({
      liveList: init ? list : [...liveList, ...list]
    });
    if (list.length < limit) {
      this.setData({ liveFinished: true });
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
      (await baseService.searchScenicList(
        keywords,
        ++this.scenicPage,
        limit
      )) || {};
    this.setData({
      scenicList: init ? list : [...scenicList, ...list]
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
      (await baseService.searchHotelList(keywords, ++this.hotelPage, limit)) ||
      {};
    this.setData({
      hotelList: init ? list : [...hotelList, ...list]
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
      (await baseService.searchRestaurantList(
        keywords,
        ++this.restaurantPage,
        limit
      )) || {};
    this.setData({
      restaurantList: init ? list : [...restaurantList, ...list]
    });
    if (list.length < limit) {
      this.setData({ restaurantFinished: true });
    }
  },

  async setGoodsCategoryOptions() {
    const options = await baseService.getShopCategoryOptions();
    const goodsCategoryOptions = [
      { icon: "", text: "全部分类", value: 0 },
      ...options.map(item => ({ icon: "", text: item.name, value: item.id }))
    ];
    this.setData({ goodsCategoryOptions });
  },

  async setGoodsList(init = false) {
    const limit = 10;
    if (init) {
      this.goodsPage = 0;
      this.setData({ goodsFinished: false });
    }
    const {
      keywords,
      curGoodsSortIndex,
      curGoodsCategoryId: categoryId,
      goodsList
    } = this.data;
    let sort = "";
    let order = "desc";
    switch (curGoodsSortIndex) {
      case 1:
        sort = "sales_volume";
        break;
      case 2:
        sort = "price";
        break;
      case 3:
        sort = "price";
        order = "asc";
        break;
    }
    const list =
      (await baseService.seachGoodsList({
        keywords,
        categoryId,
        sort,
        order,
        page: ++this.goodsPage,
        limit
      })) || [];
    this.setData({
      goodsList: init ? list : [...goodsList, ...list]
    });
    if (list.length < limit) {
      this.setData({
        goodsFinished: true
      });
    }
  },

  async setHistoryKeywords() {
    const historyKeywords = await baseService.getHistoryKeywords();
    this.setData({ historyKeywords });
  },

  async setHotKeywords() {
    const hotKeywords = await baseService.getHotKeywords();
    this.setData({ hotKeywords });
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
          baseService.clearHistoryKeywords();
        }
      }
    });
  },

  navBack() {
    customBack();
  }
});
