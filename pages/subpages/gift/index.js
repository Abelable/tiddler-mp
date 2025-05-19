import GiftService from "./utils/giftService";

const giftService = new GiftService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIdx: 0,
    goodsList: [],
    finished: false
  },

  onLoad() {
    this.setGoodsList(true);
  },

  // todo
  setMenuList() {},

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
    this.setGoodsList(true);
  },

  loadMore() {
    this.setGoodsList();
  },

  async setGoodsList(init = false) {
    if (init) {
      this.setData({ finished: false });
      this.page = 0;
    }
    const { curMenuIdx, goodsList } = this.data;
    const { list } = await giftService.getGiftList(curMenuIdx + 1, ++this.page);
    this.setData({ goodsList: init ? [...list, ...list, ...list, ...list, ...list, ...list] : [...goodsList, ...list] });
    if (!list.length) {
      this.setData({ finished: true });
    }
  }
});
