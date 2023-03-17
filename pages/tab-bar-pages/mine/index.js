import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";
import { checkLogin } from "../../../utils/index";
import MineService from "./utils/mineService";

const mineService = new MineService();
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

    async setVideoList(init = false) {
      const limit = 10;
      const { videoFinished, videoList } = this.data
      if (init) {
        this.videoPage = 0
        videoFinished && this.setData({ videoFinished: false })
      }
      const { list = [], total = 0 } = await mineService.getUserVideoList(++this.videoPage, limit) || {}
      this.setData({
        videoList: init ? list : [...videoList, ...list]
      })
      if (list.length < limit) {
        this.setData({ videoFinished: true })
      }
    },

    setWrapHeight() {
      const { curMenuIndex, wrapHeightList } = this.data;
      const query = wx.createSelectorQuery();
      query.selectAll(".content-wrap").boundingClientRect();
      query.exec((res) => {
        if (res[0][curMenuIndex]) {
          const { height } = res[0][curMenuIndex];
          if (height > wrapHeightList[curMenuIndex]) {
            this.setData({
              [`wrapHeightList[${curMenuIndex}]`]: height,
            });
          }
        }
      });
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
