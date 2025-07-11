import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { customBack } from "../../../../utils/index";
import BaseService from "../../../../services/baseService";

const baseService = new BaseService();

Page({
  data: {
    historyKeywords: [],
    hotKeywords: [],
    keywords: "",
    searching: false,
    tabScroll: 0,
    curMenuIdx: 0,
    mediaList: [],
    mediaLoading: false,
    mediaFinished: false,
    videoList: [],
    videoLoading: false,
    videoFinished: false,
    noteList: [],
    noteLoading: false,
    noteFinished: false,
    liveList: [],
    liveLoading: false,
    liveFinished: false,
    scenicList: [],
    scenicLoading: false,
    scenicFinished: false,
    hotelList: [],
    hotelLoading: false,
    hotelFinished: false,
    restaurantList: [],
    restaurantLoading: false,
    restaurantFinished: false,
    goodsList: [],
    goodsLoading: false,
    goodsFinished: false,
    userList: [],
    userLoading: false,
    userFinished: false,
    calendarPopupVisible: false
  },

  onLoad({ scene = 0 }) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["checkInDate", "checkOutDate"]
    });

    this.setData({ curMenuIdx: Number(scene) });
    this.initCalendar();
    this.setHistoryKeywords();
    this.setHotKeywords();
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
    baseService.saveKeywords(keywords);
    this.setList(true);
    this.setData({ searching: true });
  },

  cancelSearch() {
    this.setHistoryKeywords();
    this.setData({
      keywords: "",
      searching: false,
      mediaList: [],
      mediaFinished: false,
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
      goodsList: [],
      goodsFinished: false,
      userList: [],
      userFinished: false
    });
  },

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    const tabScroll = (curMenuIdx - 2) * 80;
    this.setData({ curMenuIdx, tabScroll });
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
        if (init) {
          this.setVideoList(true);
          this.setNoteList(true);
          this.setLiveList(true);
          this.setScenicList(true);
          this.setHotelList(true);
          this.setRestaurantList(true);
          this.setGoodsList(true);
          this.setUserList(true);
        }
        this.setMediaList(init);
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
        this.setUserList(init);
        break;
    }
  },

  async setMediaList(init = false) {
    if (init) {
      this.mediaPage = 0;
      this.setData({ mediaList: [], mediaFinished: false });
    }
    const { keywords, mediaList } = this.data;

    this.setData({ mediaLoading: true });
    const { list = [] } =
      (await baseService.searchMediaList(keywords, ++this.mediaPage)) || {};
    this.setData({
      mediaList: init ? list : [...mediaList, ...list],
      mediaLoading: false
    });
    if (!list.length) {
      this.setData({ mediaFinished: true });
    }
  },

  async setVideoList(init = false) {
    if (init) {
      this.videoPage = 0;
      this.setData({ videoList: [], videoFinished: false });
    }
    const { keywords, videoList } = this.data;

    this.setData({ videoLoading: true });
    const { list = [] } =
      (await baseService.searchVideoList(keywords, ++this.videoPage)) || {};
    this.setData({
      videoList: init ? list : [...videoList, ...list],
      videoLoading: false
    });
    if (!list.length) {
      this.setData({ videoFinished: true });
    }
  },

  async setNoteList(init = false) {
    if (init) {
      this.notePage = 0;
      this.setData({ noteList: [], noteFinished: false });
    }
    const { keywords, noteList } = this.data;

    this.setData({ noteLoading: true });
    const { list = [] } =
      (await baseService.searchNoteList(keywords, ++this.notePage)) || {};
    this.setData({
      noteList: init ? list : [...noteList, ...list],
      noteLoading: false
    });
    if (!list.length) {
      this.setData({ noteFinished: true });
    }
  },

  async setLiveList(init = false) {
    if (init) {
      this.livePage = 0;
      this.setData({ liveList: [], liveFinished: false });
    }
    const { keywords, liveList } = this.data;

    this.setData({ liveLoading: true });
    const { list = [] } =
      (await baseService.searchLiveRoomList(keywords, ++this.livePage)) || {};
    this.setData({
      liveList: init ? list : [...liveList, ...list],
      liveLoading: false
    });
    if (!list.length) {
      this.setData({ liveFinished: true });
    }
  },

  async setScenicList(init = false) {
    if (init) {
      this.scenicPage = 0;
      this.setData({ scenicList: [], scenicFinished: false });
    }
    const { keywords, scenicList } = this.data;

    this.setData({ scenicLoading: true });
    const { list = [] } =
      (await baseService.searchScenicList(keywords, ++this.scenicPage)) || {};
    this.setData({
      scenicList: init ? list : [...scenicList, ...list],
      scenicLoading: false
    });
    if (!list.length) {
      this.setData({ scenicFinished: true });
    }
  },

  async setHotelList(init = false) {
    if (init) {
      this.hotelPage = 0;
      this.setData({ hotelList: [], hotelFinished: false });
    }
    const { keywords, hotelList } = this.data;

    this.setData({ hotelLoading: true });
    const { list = [] } =
      (await baseService.searchHotelList(keywords, ++this.hotelPage)) || {};
    this.setData({
      hotelList: init ? list : [...hotelList, ...list],
      hotelLoading: false
    });
    if (!list.length) {
      this.setData({ hotelFinished: true });
    }
  },

  async setRestaurantList(init = false) {
    if (init) {
      this.restaurantPage = 0;
      this.setData({ restaurantList: [], restaurantFinished: false });
    }
    const { keywords, restaurantList } = this.data;

    this.setData({ restaurantLoading: true });
    const { list = [] } =
      (await baseService.searchRestaurantList(
        keywords,
        ++this.restaurantPage
      )) || {};
    this.setData({
      restaurantList: init ? list : [...restaurantList, ...list],
      restaurantLoading: false
    });
    if (!list.length) {
      this.setData({ restaurantFinished: true });
    }
  },

  async setGoodsList(init = false) {
    if (init) {
      this.goodsPage = 0;
      this.setData({ goodsList: [], goodsFinished: false });
    }
    const { keywords, goodsList } = this.data;

    this.setData({ goodsLoading: true });
    const list =
      (await baseService.searchGoodsList({
        keywords,
        page: ++this.goodsPage
      })) || [];
    this.setData({
      goodsList: init ? list : [...goodsList, ...list],
      goodsLoading: false
    });
    if (!list.length) {
      this.setData({ goodsFinished: true });
    }
  },

  async setUserList(init = false) {
    if (init) {
      this.userPage = 0;
      this.setData({ userList: [], userFinished: false });
    }
    const { keywords, userList } = this.data;

    this.setData({ userLoading: true });
    const list =
      (await baseService.searchUserList({
        keywords,
        page: ++this.userPage
      })) || [];
    this.setData({
      userList: init ? list : [...userList, ...list],
      userLoading: false
    });
    if (!list.length) {
      this.setData({ userFinished: true });
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

  showCalendarPopup() {
    this.setData({
      calendarPopupVisible: true
    });
  },

  hideCalendarPopup() {
    this.setData({
      calendarPopupVisible: false
    });
  },

  initCalendar() {
    store.setCheckInDate(new Date().getTime());

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    store.setCheckOutDate(endDate.getTime());
  },

  setCalendar(e) {
    const [start, end] = e.detail;
    store.setCheckInDate(start.getTime());
    store.setCheckOutDate(end.getTime());
    this.setData({
      calendarPopupVisible: false
    });
  },

  navBack() {
    customBack();
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
