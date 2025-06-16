import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";
import { checkLogin, debounce } from "../../../utils/index";
import HomeService from "./utils/homeService";
import {
  SCENE_SWITCH_TAB,
  SCENE_REFRESH,
  SCENE_LOADMORE
} from "../../../utils/emuns/listScene";

const homeService = new HomeService();
const { statusBarHeight } = getApp().globalData.systemInfo;
const categoryList = [
  { icon: "hot", name: "网红打卡" },
  { icon: "ship", name: "游湖登岛" },
  { icon: "cycle", name: "环湖骑行" },
  { icon: "moon", name: "夜游千岛" },
  { icon: "star", name: "明星同游" }
];

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo", "promoterInfo"]
  },

  data: {
    statusBarHeight,
    categoryList,
    navBarActive: [false, false],
    curMenuIndex: 1,
    bannerList: [],
    followMediaList: [],
    isFollowRefreshing: false,
    followFinished: false,
    mediaList: [],
    isRefreshing: false,
    isLoading: false,
    finished: false,
    scrollTop: 0
  },

  pageLifetimes: {
    show() {
      store.setTabType("home");
    }
  },

  methods: {
    onLoad(options) {
      const { superiorId = "", scene = "" } = options || {};
      const decodedScene = scene ? decodeURIComponent(scene) : "";
      this.superiorId = superiorId || decodedScene.split("-")[0];

      getApp().onLaunched(async () => {
        if (this.superiorId && !store.promoterInfo) {
          wx.setStorageSync("superiorId", this.superiorId);
          const superiorInfo = await homeService.getSuperiorInfo(
            this.superiorId
          );
          store.setPromoterInfo(superiorInfo);
        }
      });

      if (!store.locationInfo) {
        homeService.getLocationInfo();
      }
      this.initCalendar();

      this.setAdInfo();
      this.setBannerList();

      // scroll-view特效，设置isRefreshing值，即可触发初始化
      this.setData({ isRefreshing: true });

      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
    },

    initCalendar() {
      store.setCheckInDate(new Date().getTime());

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      store.setCheckOutDate(endDate.getTime());
    },

    switchMenu(e) {
      const index = Number(e.currentTarget.dataset.index);
      if (index !== this.data.curMenuIndex) {
        this.setData({ curMenuIndex: index }, () => {
          this.setList(SCENE_SWITCH_TAB);
        });
      } else {
        this.setData({ scrollTop: 0 });
      }
    },

    swiperChange(e) {
      this.handleMenuChange(Number(e.detail.current));
    },

    handleMenuChange(index) {
      const { curMenuIndex } = this.data;
      if (curMenuIndex !== index) {
        this.setData({ curMenuIndex: index }, () => {
          this.setList(SCENE_SWITCH_TAB);
        });
      }
    },

    onRefresh() {
      this.setBannerList();
      this.setList(SCENE_REFRESH);
      wx.stopPullDownRefresh();
    },

    onLoadMore() {
      this.setList(SCENE_LOADMORE);
    },

    setList(scene) {
      const { curMenuIndex, followMediaList, mediaList } = this.data;
      switch (scene) {
        case SCENE_SWITCH_TAB:
          if (curMenuIndex === 0) {
            if (!followMediaList.length) {
              this.setData({ isFollowRefreshing: true });
            }
          } else {
            if (!mediaList.length) {
              this.setData({ isRefreshing: true });
            }
          }
          this.setActiveMediaItem();
          break;

        case SCENE_REFRESH:
          if (curMenuIndex === 0) {
            this.setFollowMediaList(true);
          } else {
            this.setMediaList(true);
          }
          break;

        case SCENE_LOADMORE:
          if (curMenuIndex === 0) {
            this.setFollowMediaList();
          } else {
            this.setMediaList();
          }
          break;
      }
    },

    async setAdInfo() {
      const adInfo = await homeService.getAdInfo();
      if (adInfo) {
        this.setData({ adInfo, adModalVisible: true });
      }
    },

    async setBannerList() {
      const bannerList = await homeService.getBannerList();
      this.setData({ bannerList });
    },

    setFollowMediaList(init = false) {
      checkLogin(async () => {
        if (init) {
          this.followPage = 0;
          this.setData({
            followMediaList: [],
            isFollowRefreshing: true,
            followFinished: false
          });
        }
        const { followFinished, followMediaList } = this.data;

        if (!followFinished) {
          const { list = [] } =
            (await homeService.getFollowMediaList(++this.followPage)) || {};
          if (init) {
            this.setData({
              followMediaList: list,
              isFollowRefreshing: false
            });
          } else {
            this.setData({
              followMediaList: [...followMediaList, ...list]
            });
          }
          if (!list.length) {
            this.setData({ followFinished: true });
          }
        }
      }, false);
    },

    async setMediaList(init = false) {
      if (init) {
        this.page = 0;
        this.setData({ mediaList: [], isRefreshing: true, finished: false });
      }
      const { mediaList } = this.data;

      this.setData({ isLoading: true });
      const { list = [] } =
        (await homeService.getMediaList(++this.page)) || {};
      if (init) {
        this.setData({
          mediaList: list,
          isLoading: false,
          isRefreshing: false
        });
      } else {
        this.setData({
          mediaList: [...mediaList, ...list],
          isLoading: false
        });
      }

      if (!list.length) {
        this.setData({ finished: true });
      }
    },

    onPageScroll(e) {
      const { scrollTop } = e.detail;
      const { navBarActive, curMenuIndex } = this.data;

      if (scrollTop >= 10) {
        if (!navBarActive[curMenuIndex]) {
          this.setData({
            [`navBarActive[${curMenuIndex}]`]: true
          });
        }
      } else {
        if (navBarActive[curMenuIndex]) {
          this.setData({
            [`navBarActive[${curMenuIndex}]`]: false
          });
        }
      }

      if (curMenuIndex === 1) {
        this.setActiveMediaItem();
      }
    },

    setActiveMediaItem: debounce(function () {
      this.selectComponent(".fall-flow").setActiveMediaItem();
    }, 1000),

    search() {
      wx.navigateTo({
        url: "/pages/subpages/common/search/index"
      });
    },

    register() {
      wx.navigateTo({
        url: "/pages/subpages/common/register/index"
      });
    },

    linkTo(e) {
      const { scene, param } = e.currentTarget.dataset || {};
      if (scene) {
        switch (scene) {
          case 1:
            wx.navigateTo({
              url: `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${param}`
            });
            break;
          case 2:
            wx.navigateTo({
              url: `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${param}`
            });
            break;
          case 3:
            wx.navigateTo({
              url: `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${param}`
            });
            break;
          case 4:
            wx.navigateTo({
              url: `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${param}`
            });
            break;
          case 5:
            wx.navigateTo({
              url: `/pages/common/webview/index?url=${param}`
            });
            break;
        }
      }
    },

    onShareAppMessage() {
      const { id } = store.promoterInfo || {};
      const path = id
        ? `/pages/tab-bar-pages/home/index?superiorId=${id}`
        : "/pages/tab-bar-pages/home/index";
      return { path };
    },

    onShareTimeline() {
      const { id } = store.promoterInfo || {};
      const query = id ? `superiorId=${id}` : "";
      return { query };
    }
  }
});
