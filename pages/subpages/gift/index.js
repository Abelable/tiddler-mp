import GiftService from "./utils/giftService";

const giftService = new GiftService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarVisible: false,
    menuList: [],
    curMenuIdx: 0,
    goodsList: [],
    finished: false
  },

  async onLoad() {
    await this.setMenuList();
    await this.setGoodsList(true);

    this.setMenuTop();
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
    this.setGoodsList(true);
  },

  onPullDownRefresh() {
    this.setGoodsList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setGoodsList();
  },

  setMenuTop() {
    const query = wx.createSelectorQuery();
    query.select(".menu-wrap").boundingClientRect();
    query.exec(res => {
      this.menuTop = res[0].top;
    });
  },

  async setMenuList() {
    const menuList = await giftService.getGiftTypeOptions();
    this.setData({ menuList });
  },

  async setGoodsList(init = false) {
    if (init) {
      this.setData({ finished: false });
      this.page = 0;
    }
    const { menuList, curMenuIdx, goodsList } = this.data;
    const { list } = await giftService.getGiftList(
      menuList[curMenuIdx].id,
      ++this.page
    );
    this.setData({
      goodsList: init ? list : [...goodsList, ...list]
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  onPageScroll(e) {
    const { navBarVisible } = this.data;

    if (e.scrollTop >= this.menuTop - statusBarHeight - 44) {
      if (!navBarVisible) this.setData({ navBarVisible: true });
    } else {
      if (navBarVisible) this.setData({ navBarVisible: false });
    }
  }
});
