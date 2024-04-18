import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { debounce } from "../../../../utils/index";
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
      { icon: "", text: "价格升序", value: 3 },
    ],
    curCategoryId: 0,
    categoryOptions: [],
    calendarPopupVisibel: false,
    keywords: "",
    hotelList: [],
    finished: false,
  },

  async onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["checkInDate", "checkOutDate"],
    });

    this.initCalendar();
    if (!store.locationInfo) {
      await this.setLocationInfo();
    }
    await this.setCategoryOptions();
    this.setHotelList(true);
  },

  async setLocationInfo() {
    const { authSetting } = await hotelService.getSetting();
    if (authSetting["scope.userLocation"] !== false) {
      const { longitude, latitude } = await hotelService.getLocation();
      store.setLocationInfo({ longitude, latitude });
    }
  },

  async setCategoryOptions() {
    const options = await hotelService.getHotelCategoryOptions();
    const categoryOptions = [
      { icon: "", text: "全部分类", value: 0 },
      ...options.map((item) => ({ icon: "", text: item.name, value: item.id })),
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

  setKeywords: debounce(function (e) {
    this.setData({
      keywords: e.detail.value,
    });
  }, 500),

  clearKeywords() {
    this.setData(
      {
        keywords: "",
      },
      () => {
        this.setHotelList(true);
      }
    );
  },

  search() {
    if (!this.data.keywords) {
      return;
    }
    this.setHotelList(true);
  },

  async setHotelList(init = false) {
    const limit = 10;
    if (init) {
      this.page = 0;
      this.setData({
        finished: false,
      });
    }
    const { keywords, curSortIndex, curCategoryId, hotelList } = this.data;
    let sort = "";
    let order = "desc";
    switch (curSortIndex) {
      case 1:
        sort = "rate";
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
        keywords,
        categoryId: curCategoryId,
        sort,
        order,
        page: ++this.page,
        limit,
      })) || [];
    this.setData({
      hotelList: init ? list : [...hotelList, ...list],
    });
    if (list.length < limit) {
      this.setData({
        finished: true,
      });
    }
  },

  showCalendarPopup() {
    this.setData({
      calendarPopupVisibel: true,
    });
  },

  hideCalendarPopup() {
    this.setData({
      calendarPopupVisibel: false,
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
      calendarPopupVisibel: false,
    });
  },

  navBack() {
    wx.navigateBack();
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
