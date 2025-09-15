import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
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
      { icon: "", text: "价格升序", value: 3 }
    ],
    curCategoryId: 0,
    categoryOptions: [],
    restaurantList: [],
    finished: false
  },

  async onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["checkInDate", "checkOutDate"]
    });

    if (!store.locationInfo) {
      await cateringService.getLocationInfo();
    }
    await this.setCategoryOptions();
    this.setRestaurantList(true);
  },

  async setCategoryOptions() {
    const options = await cateringService.getRestaurantCategoryOptions();
    const categoryOptions = [
      { icon: "", text: "全部分类", value: 0 },
      ...options.map(item => ({ icon: "", text: item.name, value: item.id }))
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

  async setRestaurantList(init = false) {
    const limit = 10;
    if (init) {
      this.page = 0;
      this.setData({
        finished: false
      });
    }
    const { curSortIndex, curCategoryId, restaurantList } = this.data;
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
      (await cateringService.getRestaurantList({
        categoryId: curCategoryId,
        sort,
        order,
        page: ++this.page,
        limit
      })) || [];
    this.setData({
      restaurantList: init ? list : [...restaurantList, ...list]
    });
    if (list.length < limit) {
      this.setData({
        finished: true
      });
    }
  },

  onReachBottom() {
    this.setRestaurantList();
  },

  onPullDownRefresh() {
    this.setRestaurantList(true);
    wx.stopPullDownRefresh();
  },

  search() {
    wx.navigateTo({
      url: "/pages/subpages/common/search/index?scene=6"
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
