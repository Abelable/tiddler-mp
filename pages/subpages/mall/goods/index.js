import { checkLogin, customBack } from "../../../../utils/index";
import GoodsService from "./utils/goodsService";

const goodsService = new GoodsService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    cartGoodsNumber: 0,
    categoryOptions: [],
    subCategoryOptions: [],
    activeTabIdx: 0,
    activeSubTabIdx: 0,
    tabScroll: 0,
    goodsList: [],
    loading: false,
    finished: false
  },

  async onLoad() {
    await this.setCategoryOptions();
    this.setGoodsList(true);
  },

  onShow() {
    checkLogin(() => {
      this.setCartGoodsNumber();
    }, false);
  },

  async selectCate(e) {
    const activeTabIdx = Number(e.currentTarget.dataset.idx);
    this.setData({
      activeTabIdx,
      activeSubTabIdx: 0,
      tabScroll: (activeTabIdx - 2) * 80
    });
    if (activeTabIdx === 0) {
      this.setData({ subCategoryOptions: [] });
    } else {
      await this.setSubCategoryOptions();
    }
    this.setGoodsList(true);
  },

  selectSubCate(e) {
    const activeSubTabIdx = Number(e.currentTarget.dataset.idx);
    this.setData({ activeSubTabIdx });
    this.setGoodsList(true);
  },

  async setCategoryOptions() {
    const options = await goodsService.getShopCategoryOptions();
    this.setData({
      categoryOptions: [{ id: 0, name: "推荐" }, ...options]
    });
  },

  async setSubCategoryOptions() {
    const { categoryOptions, activeTabIdx } = this.data;
    const options = await goodsService.getGoodsCategoryOptions(
      categoryOptions[activeTabIdx].id
    );
    this.setData({
      subCategoryOptions: [{ id: 0, name: "全部商品" }, ...options]
    });
  },

  async setGoodsList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ goodsList: [], finished: false });
    }
    const {
      categoryOptions,
      activeTabIdx,
      subCategoryOptions,
      activeSubTabIdx,
      goodsList
    } = this.data;
    this.setData({ loading: true });
    const list =
      (await goodsService.getGoodsList({
        shopCategoryId: categoryOptions[activeTabIdx].id || undefined,
        categoryId: subCategoryOptions.length
          ? subCategoryOptions[activeSubTabIdx].id
          : undefined,
        page: ++this.page
      })) || [];
    this.setData({
      goodsList: init ? list : [...goodsList, ...list],
      loading: false
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  async setCartGoodsNumber() {
    const cartGoodsNumber = await goodsService.getCartGoodsNumber();
    this.setData({ cartGoodsNumber });
  },

  onReachBottom() {
    this.setGoodsList();
  },

  onPullDownRefresh() {
    this.setGoodsList(true);
    wx.stopPullDownRefresh();
  },

  navBack() {
    customBack();
  },

  search() {
    wx.navigateTo({
      url: "/pages/subpages/common/search/index?scene=7"
    });
  }
});
