import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { checkLogin } from "../../../../utils/index";
import { formatter } from "./utils/index";
import HotelService from "./utils/hotelService";

const hotelService = new HotelService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    formatter,
    curSortIndex: 0,
    sortOptions: [
      { icon: "", text: "综合排序", value: 0 },
      { icon: "", text: "好评排序", value: 1 },
      { icon: "", text: "价格降序", value: 2 },
      { icon: "", text: "价格升序", value: 3 }
    ],
    curCategoryId: 0,
    categoryOptions: [],
    calendarPopupVisible: false,
    hotelList: [],
    finished: false
  },

  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["checkInDate", "checkOutDate"]
    });

    if (!store.checkInDate) {
      this.initCalendar();
    }
    if (!store.locationInfo) {
      await hotelService.getLocationInfo();
    }

    await this.setCategoryOptions();
    this.setHotelList(true);

    // todo 团圆家乡年
    checkLogin(() => {
      this.taskTimeout = setTimeout(() => {
        hotelService.finishTask(12);
      }, 10000);
    }, false);
  },

  async setCategoryOptions() {
    const options = await hotelService.getHotelCategoryOptions();
    const categoryOptions = [
      { icon: "", text: "全部分类", value: 0 },
      ...options.map(item => ({ icon: "", text: item.name, value: item.id }))
    ];
    this.setData({ categoryOptions });
  },

  setSortIndex(e) {
    const curSortIndex = Number(e.detail);
    this.setData({ curSortIndex }, () => {
      this.setHotelList(true);
    });
  },

  setCategoryId(e) {
    const curCategoryId = Number(e.detail);
    this.setData({ curCategoryId }, () => {
      this.setHotelList(true);
    });
  },

  async setHotelList(init = false) {
    const limit = 10;
    if (init) {
      this.page = 0;
      this.setData({
        finished: false
      });
    }
    const { curSortIndex, curCategoryId, hotelList } = this.data;
    let sort = "";
    let order = "desc";
    switch (curSortIndex) {
      case 1:
        sort = "score";
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
      (await hotelService.getHotelList({
        categoryId: curCategoryId,
        sort,
        order,
        page: ++this.page,
        limit
      })) || [];
    this.setData({
      hotelList: init ? list : [...hotelList, ...list]
    });
    if (list.length < limit) {
      this.setData({
        finished: true
      });
    }
  },

  onReachBottom() {
    this.setHotelList();
  },

  onPullDownRefresh() {
    this.setHotelList(true);
    wx.stopPullDownRefresh();
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

  search() {
    wx.navigateTo({
      url: "/pages/subpages/common/search/index?scene=5"
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();

    // todo 团圆家乡年
    if (this.taskTimeout) {
      clearTimeout(this.taskTimeout);
    }
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath = "/pages/subpages/mall/hotel/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return {
      path,
      title: "千岛湖酒店民宿",
      imageUrl: "https://static.tiddler.cn/mp/share_cover.png"
    };
  },

  onShareTimeline() {
    const { id } = store.superiorInfo || {};
    const query = id ? `superiorId=${id}` : "";
    return {
      query,
      title: "千岛湖酒店民宿",
      imageUrl: "https://static.tiddler.cn/mp/share_cover.png"
    };
  }
});
