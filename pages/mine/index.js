import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import { checkLogin } from "../../utils/index";
import BaseService from "../../services/baseService";

const baseService = new BaseService();
const { statusBarHeight } = getApp().globalData;

Page({
  data: {
    statusBarHeight,
    curMenuIndex: 0,
    navBarVisible: false,
    menuFixed: false,
    worksListHeightArr: [400, 400, 400, 400],
    videoList: [],
    noteList: [],
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
    });

    this.setNavBarVisibleLimit();
    this.setMenuFixedLimit();
    this.scrollTopArr = [0, 0, 0, 0];
  },

  onShow() {
    // checkLogin(() => {
    //   !store.userInfo && baseService.getUserInfo()
    // })
  },

  switchMenu(e) {
    this.setData({
      curMenuIndex: e.currentTarget.dataset.index,
    });
  },

  switchMenu(e) {
    this.handleMenuChange(Number(e.currentTarget.dataset.index));
  },

  swiperChange(e) {
    this.handleMenuChange(Number(e.detail.current));
  },

  handleMenuChange(index) {
    const { curMenuIndex } = this.data;
    if (curMenuIndex !== index) {
      this.setData({ curMenuIndex: index });
      this.scrollTopArr[curMenuIndex] = this.scrollTop || 0;
      wx.pageScrollTo({
        scrollTop: this.scrollTopArr[index] || 0,
        duration: 0,
      });
    }
  },

  setNavBarVisibleLimit() {
    const query = wx.createSelectorQuery();
    query.select(".name").boundingClientRect();
    query.exec((res) => {
      this.navBarVisibleLimit = res[0].bottom;
    });
  },

  setMenuFixedLimit() {
    const query = wx.createSelectorQuery();
    query.select(".works-menu").boundingClientRect();
    query.exec((res) => {
      this.menuFixedLimit = res[0].top - statusBarHeight - 44;
    });
  },

  onReachBottom() {},

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  onPageScroll(e) {
    if (e.scrollTop >= this.navBarVisibleLimit) {
      !this.data.navBarVisible &&
        this.setData({
          navBarVisible: true,
        });
    } else {
      this.data.navBarVisible &&
        this.setData({
          navBarVisible: false,
        });
    }

    if (e.scrollTop >= this.menuFixedLimit) {
      !this.data.menuFixed &&
        this.setData({
          menuFixed: true,
        });
    } else {
      this.data.menuFixed &&
        this.setData({
          menuFixed: false,
        });
    }

    this.scrollTop = e.scrollTop;
  },

  async navToLive() {
    const statusInfo = await baseService.getRoomStatus();
    if (!statusInfo) {
      wx.navigateTo({
        url: "./suppages/live-management/create-live/index",
      });
    } else {
      const { status, direction } = statusInfo;
      const url =
        status === 3
          ? "./suppages/live-management/live-notice/index"
          : `./suppages/live-management/live-push/${
              direction === 1 ? "vertical" : "horizontal"
            }-screen/index`;
      wx.navigateTo({ url });
    }
  },
});
