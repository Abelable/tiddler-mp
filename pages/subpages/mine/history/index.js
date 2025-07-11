import HistoryService from "./utils/historyService";

const historyService = new HistoryService();

Page({
  data: {
    menuList: ["游记", "景点", "酒店", "美食", "商品"],
    curMenuIdx: 0,
    mediaList: [],
    loading: false,
    finished: false,
    productLists: [
      { list: [], loading: false, finished: false },
      { list: [], loading: false, finished: false },
      { list: [], loading: false, finished: false },
      { list: [], loading: false, finished: false }
    ]
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
    if (init) {
      this.mediaPage = 0;
      this.setData({ mediaList: [], finished: false });
    }

    this.setData({ loading: true });
    const list = await historyService.getMediaHistoryList(++this.mediaPage);
    this.setData({
      mediaList: init ? list : [...this.data.mediaList, ...list],
      loading: false
    });

    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  async setProductList(init = false) {
    const { curMenuIdx, productLists } = this.data;

    if (init) {
      if (!this.productPages) {
        this.productPages = [0, 0, 0, 0];
      }
      this.productPages[curMenuIdx - 1] = 0;
      this.setData({
        [`productLists[${curMenuIdx - 1}].list`]: [],
        [`productLists[${curMenuIdx - 1}].finished`]: false
      });
    }

    this.setData({
      [`productLists[${curMenuIdx - 1}].loading`]: true
    });
    const list = await historyService.getProductHistoryList(
      curMenuIdx,
      ++this.productPages[curMenuIdx - 1]
    );
    this.setData({
      [`productLists[${curMenuIdx - 1}].list`]: init
        ? list
        : [...productLists[curMenuIdx - 1].list, ...list],
      [`productLists[${curMenuIdx - 1}].loading`]: false
    });

    if (!list.length) {
      this.setData({
        [`productLists[${curMenuIdx - 1}].finished`]: true
      });
    }
  }
});
