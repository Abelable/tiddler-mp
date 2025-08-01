import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import dayjs from "dayjs";
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
const classificationList = [
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
    fields: ["userInfo", "superiorInfo"]
  },

  data: {
    statusBarHeight,
    classificationList,
    pageLoaded: false,
    navBarActive: [false, false],
    curMenuIndex: 1,
    bannerList: [],
    topMediaList: [],
    followMediaList: [],
    followRefreshing: false,
    followLoading: false,
    followFinished: false,
    mediaList: [],
    refreshing: false,
    loading: false,
    finished: false,
    scrollTop: 0
  },

  pageLifetimes: {
    show() {
      store.setTabType("home");
    }
  },

  methods: {
    async onLoad(options) {
      const { superiorId = "", scene = "" } = options || {};
      const decodedScene = scene ? decodeURIComponent(scene) : "";
      this.superiorId = superiorId || decodedScene.split("-")[0];

      getApp().onLaunched(async () => {
        if (this.superiorId && !store.superiorInfo) {
          wx.setStorageSync("superiorId", this.superiorId);
          const superiorInfo = await homeService.getUserInfo(this.superiorId);
          if (superiorInfo.promoterInfo) {
            store.setSuperiorInfo(superiorInfo);
          }
        }
      });

      if (!store.locationInfo) {
        homeService.getLocationInfo();
      }
      this.initCalendar();

      this.setAdInfo();
      await this.setBannerList();
      await this.setTopMediaList();
      this.setList(SCENE_REFRESH);

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
              this.setData({ followRefreshing: true });
            }
          } else {
            if (!mediaList.length) {
              this.setData({ refreshing: true });
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

    async setTopMediaList() {
      const { list = [] } = await homeService.getTopMediaList(1, 6);
      const monthDescList = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
      ];
      const topMediaList = list.map((item, index) => {
        const time = dayjs().subtract(index, "day");
        const year = time.year();
        const monthIdx = time.month();
        const date = `${time.date()}`.padStart(2, "0");
        return {
          ...item,
          year,
          month: monthDescList[monthIdx],
          date
        };
      });
      this.setData({ topMediaList });
    },

    setFollowMediaList(init = false) {
      checkLogin(async () => {
        if (init) {
          this.followPage = 0;
          this.setData({
            followMediaList: [],
            followRefreshing: true,
            followFinished: false
          });
        }
        const { followMediaList } = this.data;

        this.setData({ followLoading: true });
        const { list = [] } =
          (await homeService.getFollowMediaList(++this.followPage)) || {};
        if (init) {
          this.setData({
            followMediaList: list,
            followLoading: false,
            followRefreshing: false
          });
        } else {
          this.setData({
            followMediaList: [...followMediaList, ...list],
            followLoading: false
          });
        }
        if (!list.length) {
          this.setData({ followFinished: true });
        }
      }, false);
    },

    async setMediaList(init = false) {
      if (init) {
        this.page = 0;
        this.setData({ mediaList: [], refreshing: true, finished: false });
      }
      const { mediaList } = this.data;

      this.setData({ loading: true });
      const { list = [] } = (await homeService.getMediaList(++this.page)) || {};
      if (init) {
        this.setData({
          mediaList: list,
          loading: false,
          refreshing: false,
          pageLoaded: true
        });
      } else {
        this.setData({
          mediaList: [...mediaList, ...list],
          loading: false
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

    checkClassification(e) {
      const { index } = e.currentTarget.dataset;
      const pathList = [
        "hot-scenic",
        "lake-trip",
        "lake-cycle",
        "night-trip",
        "star-trip"
      ];
      const url = `/pages/subpages/home/trip-type/${pathList[index]}/index`;
      wx.navigateTo({ url });
    },

    onShareAppMessage() {
      const { id } = store.superiorInfo || {};
      const path = id
        ? `/pages/tab-bar-pages/home/index?superiorId=${id}`
        : "/pages/tab-bar-pages/home/index";
      return { path };
    },

    onShareTimeline() {
      const { id } = store.superiorInfo || {};
      const query = id ? `superiorId=${id}` : "";
      return { query };
    }
  }
});
