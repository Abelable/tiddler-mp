import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { debounce } from "../../../../utils/index";
import { formatter } from "./utils/index";
import CateringService from "./utils/cateringService";

const cateringService = new CateringService();
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
    keywords: "",
    restaurantList: [],
    finished: false,
  },

  async onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["checkInDate", "checkOutDate"],
    });

    await this.setLocationInfo();
    await this.setCategoryOptions();
    this.setRestaurantList(true);
  },

  async setLocationInfo() {
    const { authSetting } = await cateringService.getSetting();
    if (authSetting["scope.userLocation"] !== false) {
      const { longitude, latitude } = await cateringService.getLocation();
      store.setLocationInfo({ longitude, latitude });
    }
  },

  async setCategoryOptions() {
    const options = await cateringService.getRestaurantCategoryOptions();
    const categoryOptions = [
      { icon: "", text: "全部分类", value: 0 },
      ...options.map((item) => ({ icon: "", text: item.name, value: item.id })),
    ];
    this.setData({ categoryOptions });
  },

  setSortIndex(e) {
    const curSortIndex = Number(e.detail);
    this.setData({ curSortIndex }, () => {
      this.setRestaurantList(true);
    });
  },

  setCategoryId(e) {
    const curCategoryId = Number(e.detail);
    this.setData({ curCategoryId }, () => {
      this.setRestaurantList(true);
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
        this.setRestaurantList(true);
      }
    );
  },

  search() {
    if (!this.data.keywords) {
      return;
    }
    this.setRestaurantList(true);
  },

  async setRestaurantList(init = false) {
    const limit = 10;
    if (init) {
      this.page = 0;
      this.setData({
        finished: false,
      });
    }
    const { keywords, curSortIndex, curCategoryId, restaurantList } = this.data;
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
      (await cateringService.getRestaurantList({
        name: keywords,
        categoryId: curCategoryId,
        sort,
        order,
        page: ++this.page,
        limit,
      })) || [];
    this.setData({
      restaurantList: init ? list : [...restaurantList, ...list],
    });
    if (list.length < limit) {
      this.setData({
        finished: true,
      });
    }
  },

  navBack() {
    wx.navigateBack();
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
