import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";
import { checkLogin } from "../../../utils/index";
import BaseService from "../../../services/baseService";

const baseService = new BaseService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"],
  },

  data: {
    statusBarHeight,
    curMenuIndex: 0,
    navBarVisible: false,
    menuFixed: false,
    wrapHeightList: [400, 400, 400, 400],
    videoListTotal: 0,
    videoList: [],
    videoFinished: false,
    noteListTotal: 0,
    noteList: [],
    noteFinished: false,
    collectMediaList: [],
    collectFinished: false,
    likeMediaList: [],
    likeFinished: false,
  },

  lifetimes: {
    attached() {
      this.setNavBarVisibleLimit();
      this.setMenuFixedLimit();
      this.scrollTopArr = [0, 0, 0, 0];
    },
  },

  pageLifetimes: {
    show() {
      store.setTabType("mine");

      // checkLogin(() => {
      //   !store.userInfo && baseService.getUserInfo()
      // })
    },
  },

  methods: {
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

    onPullDownRefresh() {
      wx.stopPullDownRefresh();
    },

    onReachBottom() {},

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
          url: "/pages/subpages/live/create-live/index",
        });
      } else {
        const { status, direction } = statusInfo;
        const url =
          status === 3
            ? "/pages/subpages/live/live-notice/index"
            : `/pages/subpages/live/live-push/${
                direction === 1 ? "vertical" : "horizontal"
              }-screen/index`;
        wx.navigateTo({ url });
      }
    },
  },
});
