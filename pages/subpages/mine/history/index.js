import HistoryService from "./utils/historyService";

const historyService = new HistoryService();

Page({
  data: {
    menuList: ["游记", "景点", "酒店", "美食", "商品"],
    curMenuIdx: 0,
    mediaList: [],
    finished: false,
    productLists: [
      { list: [], finished: false },
      { list: [], finished: false },
      { list: [], finished: false },
      { list: [], finished: false }
    ],
    isLoading: false
  },

  onLoad() {
    this.setList(true);
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
    if (curMenuIdx !== 0 && !this.data.productLists[curMenuIdx - 1].length) {
      this.setList(true);
    }
  },

  onPullDownRefresh() {
    this.setList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setList();
  },

  setList(init = false) {
    if (this.data.curMenuIdx === 0) {
      this.setMediaList(init);
    } else {
      this.setProductList(init);
    }
  },

  async setMediaList(init = false) {
    this.setData({ isLoading: true })
    if (init) {
      this.mediaPage = 0;
      this.setData({ finished: false });
    }

    const list = await historyService.getMediaHistoryList(++this.mediaPage);
    this.setData({
      mediaList: init ? list : [...this.data.mediaList, ...list],
      isLoading: false
    });

    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  async setProductList(init = false) {
    this.setData({ isLoading: true })
    const { curMenuIdx, productLists } = this.data;
    if (init) {
      if (!this.productPages) {
        this.productPages = [0, 0, 0, 0];
      }
      this.productPages[curMenuIdx - 1] = 0;
      this.setData({
        [`productLists[${curMenuIdx - 1}].finished`]: false,
      });
    }

    const list = await historyService.getProductHistoryList(
      curMenuIdx,
      ++this.productPages[curMenuIdx - 1]
    );
    this.setData({
      [`productLists[${curMenuIdx - 1}].list`]: init
        ? list
        : [...productLists[curMenuIdx - 1].list, ...list],
        isLoading: false
    });

    if (!list.length) {
      this.setData({
        [`productLists[${curMenuIdx - 1}].finished`]: true
      });
    }
  }
});
