import { customBack, debounce } from "../../../../utils/index";
import MediaService from "../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    historyKeywordsList: [],
    keywords: "",
    isSearching: false,
    curMenuIdx: 0,
    shortVideoList: [],
    tourismNoteList: [],
    liveRoomList: [],
    finished: false,
  },

  onLoad() {
    if (wx.getStorageSync("mediaKeywordsList")) {
      this.setData({
        historyKeywordsList: JSON.parse(
          wx.getStorageSync("mediaKeywordsList")
        ),
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
            historyKeywordsList: [],
          });
          wx.removeStorage({ key: "mediaKeywordsList" });
        }
      },
    });
  },

  navBack() {
    customBack();
  },

  onUnload() {
    wx.setStorage({
      key: "mediaKeywordsList",
      data: JSON.stringify(this.data.historyKeywordsList),
    });
  },
});
