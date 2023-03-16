import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from "../../../store/index";
import HomeService from "./utils/homeService";
import {
  SCENE_SWITCH_TAB,
  SCENE_REFRESH,
  SCENE_LOADMORE,
} from "./utils/sceneEnums";

const homeService = new HomeService();
const { statusBarHeight, windowHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['userInfo'],
  },

  data: {
    statusBarHeight,
    navBarActive: false,
    wrapHeightList: [windowHeight, windowHeight],
    curMenuIndex: 1,
    followMediaList: [],
    mediaList: [],
  },

  lifetimes: {
    attached() {
      this.scrollTopArr = [0, 0];
    },
  },

  pageLifetimes: {
    show() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
      });

      store.setTabType("home");
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

    onReachBottom() {},

    onPullDownRefresh() {
      wx.stopPullDownRefresh();
    },

    setWrapHeight() {
      const { curMenuIndex } = this.data;
      const query = wx.createSelectorQuery();
      query.selectAll(".content-wrap").boundingClientRect();
      query.exec((res) => {
        if (res[0][curMenuIndex]) {
          this.setData({
            [`wrapHeightList[${curMenuIndex}]`]: res[0][curMenuIndex].height,
          });
        }
      });
    },

    onPageScroll(e) {
      if (e.scrollTop >= 10) {
        if (!this.data.navBarActive) {
          this.setData({
            navBarActive: true,
          });
        }
      } else {
        if (this.data.navBarActive) {
          this.setData({
            navBarActive: false,
          });
        }
      }

      this.scrollTop = e.scrollTop;
    },

    search() {
      wx.navigateTo({
        url: "/pages/subpages/home/search/index",
      });
    },

    onShareAppMessage() {},

    onShareTimeline() {},
  },
});
