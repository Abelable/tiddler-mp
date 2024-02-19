import { customBack, debounce } from "../../../../../../utils/index";
import GoodsService from "../../utils/goodsService";

const goodsService = new GoodsService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    historyKeywords: [],
    hotKeywords: [],
    curSortIndex: 0,
    sortOptions: [
      { icon: "", text: "综合排序", value: 0 },
      { icon: "", text: "销量排序", value: 1 },
      { icon: "", text: "价格降序", value: 2 },
      { icon: "", text: "价格升序", value: 3 },
    ],
    curCategoryId: 0,
    categoryOptions: [],
    keywords: "",
    isSearching: false,
    goodsList: [],
    finished: false,
  },

  onLoad() {
    this.setCategoryOptions();
    this.setHistoryKeywords();
    this.setHotKeywords();
  },

  async setCategoryOptions() {
    const options = await goodsService.getShopCategoryOptions();
    const categoryOptions = [
      { icon: "", text: "全部分类", value: 0 },
      ...options.map((item) => ({ icon: "", text: item.name, value: item.id })),
    ];
    this.setData({ categoryOptions });
  },

  setKeywords(e) {
    this.setData({
      keywords: e.detail.value,
    });
  },

  cancelSearch() {
    this.setHistoryKeywords();
    this.setData({
      keywords: "",
      curSortIndex: 0,
      curCategoryId: 0,
    });
    if (this.data.isSearching) {
      this.setData({ isSearching: false });
    }
  },

  selectKeywords(e) {
    const { keywords } = e.currentTarget.dataset;
    this.setData({
      keywords,
      isSearching: true,
    });
    this.setGoodsList(true);
  },

  setSortIndex(e) {
    this.setData({
      curSortIndex: e.detail,
    });
    this.search();
  },

  setCategoryId(e) {
    this.setData({
      curCategoryId: e.detail,
    });
    this.search();
  },

  search() {
    const { keywords, isSearching, historyKeywords } = this.data;
    if (!keywords) {
      return;
    }
    this.setData({
      historyKeywords: Array.from(
        new Set([...historyKeywords, keywords])
      ),
    });
    if (!isSearching) {
      this.setData({ isSearching: true });
    }
    this.setGoodsList(true);
  },

  async setGoodsList(init = false) {
    const limit = 10;
    if (init) {
      this.page = 0;
      this.setData({
        finished: false,
      });
    }
    const { keywords, curSortIndex, curCategoryId, goodsList } = this.data;
    let sort = "";
    let order = "desc";
    switch (curSortIndex) {
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
      (await goodsService.seachGoodsList({
        keywords,
        categoryId: curCategoryId,
        sort,
        order,
        page: ++this.page,
        limit,
      })) || [];
    this.setData({
      goodsList: init ? list : [...goodsList, ...list],
    });
    if (list.length < limit) {
      this.setData({
        finished: true,
      });
    }
  },

  async setHistoryKeywords() {
    const historyKeywords = await goodsService.getHistoryKeywords();
    this.setData({ historyKeywords });
  },
  
  async setHotKeywords() {
    const hotKeywords = await goodsService.getHotKeywords();
    this.setData({ hotKeywords });
  },

  onReachBottom() {
    this.setGoodsList();
  },

  onPullDownRefresh() {
    this.setGoodsList(true);
    wx.stopPullDownRefresh();
  },

  clearHistoryKeywords() {
    wx.showModal({
      content: "确定清空历史搜索记录吗？",
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          this.setData({
            historyKeywords: [],
          });
          goodsService.clearHistoryKeywords();
        }
      },
    });
  },

  navBack() {
    customBack();
  },
});
