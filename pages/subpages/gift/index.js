import { store } from "../../../store/index";
import GiftService from "./utils/giftService";

const giftService = new GiftService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarVisible: false,
    menuList: [],
    curMenuIdx: 0,
    goodsLists: [
      { list: [], loading: false, finished: false },
      { list: [], loading: false, finished: false },
      { list: [], loading: false, finished: false },
      { list: [], loading: false, finished: false }
    ]
  },

  async onLoad({ curMenuIdx = 0 }) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    if (curMenuIdx !== 0) {
      this.setData({ curMenuIdx: Number(curMenuIdx) });
    }

    this.pageList = [0, 0, 0, 0];
    await this.setMenuList();
    await this.setGoodsList(true);

    this.setMenuTop();
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
    if (!this.data.goodsLists[curMenuIdx].list.length) {
      this.setGoodsList(true);
    }
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
    const { curMenuIdx } = this.data;
    if (init) {
      this.setData({
        [`goodsLists[${curMenuIdx}].list`]: [],
        [`goodsLists[${curMenuIdx}].finished`]: false
      });
      this.pageList[curMenuIdx] = 0;
    }
    const { menuList, goodsLists } = this.data;
    const goodsList = goodsLists[curMenuIdx].list;

    this.setData({ [`goodsLists[${curMenuIdx}].loading`]: true });
    const { list = [] } =
      (await giftService.getGiftList(
        menuList[curMenuIdx].id,
        ++this.pageList[curMenuIdx],
        init ? "加载中" : ""
      )) || {};
    this.setData({
      [`goodsLists[${curMenuIdx}].list`]: init ? list : [...goodsList, ...list],
      [`goodsLists[${curMenuIdx}].loading`]: false
    });
    if (!list.length) {
      this.setData({ [`goodsLists[${curMenuIdx}].finished`]: true });
    }
  },

  onPageScroll(e) {
    const { navBarVisible } = this.data;

    if (e.scrollTop >= this.menuTop - statusBarHeight - 44) {
      if (!navBarVisible) this.setData({ navBarVisible: true });
    } else {
      if (navBarVisible) this.setData({ navBarVisible: false });
    }
  },

  onShareAppMessage() {
    const { curMenuIdx } = this.data;
    const { id } = store.superiorInfo || {};
    const originalPath = `/pages/subpages/gift/index?curMenuIdx=${curMenuIdx}`;
    const path = id ? `${originalPath}&superiorId=${id}` : originalPath;
    return {
      path,
      title: "家乡好物",
      imageUrl: "https://static.tiddler.cn/mp/gift/share.webp"
    };
  },

  onShareTimeline() {
    const { curMenuIdx } = this.data;
    const { id } = store.superiorInfo || {};
    const query = id ? `curMenuIdx=${curMenuIdx}&superiorId=${id}` : `curMenuIdx=${curMenuIdx}`;
    return { query, title: "家乡好物", imageUrl: "https://static.tiddler.cn/mp/gift/share.jpg" };
  }
});
