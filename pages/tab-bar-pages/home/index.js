import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import dayjs from "dayjs";
import { store } from "../../../store/index";
import { checkLogin, debounce } from "../../../utils/index";
import HomeService from "./utils/homeService";
import {
  SCENE_SWITCH_TAB,
  SCENE_SWITCH_SUB_TAB,
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
    adInfo: null,
    adModalVisible: false,
    navBarActive: [false, false],
    curMenuIndex: 1,
    curSubMenuIndex: 0,
    bannerList: [],
    curDot: 0,
    topMediaList: [],
    followMediaList: [],
    followRefreshing: false,
    followLoading: false,
    followFinished: false,
    mediaList: [],
    refreshing: false,
    loading: false,
    finished: false,
    nearbyProductList: [],
    nearbyRefreshing: false,
    nearbyLoading: false,
    nearbyFinished: false,
    scrollTopList: [0, 0, 0],
    scrolling: false
  },

  pageLifetimes: {
    show() {
      store.setTabType("home");
    }
  },

  methods: {
    async onLoad() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });

      if (!store.locationInfo) {
        homeService.getLocationInfo();
      }
      if (!store.checkInDate) {
        this.initCalendar();
      }

      this.setAdInfo();
      this.setList(SCENE_REFRESH);
      await this.setBannerList();
      await this.setTopMediaList();
      this.setData({ pageLoaded: true });
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
        this.setData({
          [`scrollTopList[${index}]`]: 0
        });
      }
    },

    switchSubMenu(e) {
      const index = Number(e.currentTarget.dataset.index);
      if (index !== this.data.curSubMenuIndex) {
        this.setData({ curSubMenuIndex: index }, () => {
          this.setList(SCENE_SWITCH_SUB_TAB);
        });
      } else {
        this.setData({
          [`scrollTopList[${index}]`]: 0
        });
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
      if (this.data.curMenuIndex === 1) {
        this.setBannerList();
      }
      this.setList(SCENE_REFRESH);
      wx.stopPullDownRefresh();
    },

    onLoadMore() {
      this.setList(SCENE_LOADMORE);
    },

    setList(scene) {
      const { curMenuIndex, followMediaList, mediaList, nearbyProductList } =
        this.data;
      switch (scene) {
        case SCENE_SWITCH_TAB:
          if (curMenuIndex === 0) {
            if (!followMediaList.length) {
              checkLogin(() => {
                this.setData({ followRefreshing: true });
              }, false);
            }
          } else if (curMenuIndex === 1) {
            if (!mediaList.length) {
              this.setData({ refreshing: true });
            }
          } else {
            if (!nearbyProductList.length) {
              this.setData({ nearbyRefreshing: true });
            }
          }
          this.setActiveMediaItem();
          break;

        case SCENE_SWITCH_SUB_TAB:
          this.setData({ nearbyRefreshing: true });
          break;

        case SCENE_REFRESH:
          if (curMenuIndex === 0) {
            this.setFollowMediaList(true);
          } else if (curMenuIndex === 1) {
            this.setMediaList(true);
          } else {
            this.setNearbyProductList(true);
          }
          break;

        case SCENE_LOADMORE:
          if (curMenuIndex === 0) {
            this.setFollowMediaList();
          } else if (curMenuIndex === 1) {
            this.setMediaList();
          } else {
            this.setNearbyProductList();
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
            followRefreshing: true
          });
        }
        const { followMediaList } = this.data;

        this.setData({ followLoading: true, followFinished: false });
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
        this.setData({ mediaList: [], refreshing: true });
      }
      const { mediaList } = this.data;

      this.setData({ loading: true, finished: false });
      const { list = [] } =
        (await homeService.getRandomMediaList(++this.page)) || {};
      if (init) {
        this.setData({
          mediaList: list,
          loading: false,
          refreshing: false
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

    async setNearbyProductList(init = false) {
      if (init) {
        this.nearbyPage = 0;
        this.setData({
          nearbyProductList: [],
          nearbyRefreshing: true
        });
      }
      const { longitude = 0, latitude = 0 } = store.locationInfo || {};
      const { nearbyProductList, curSubMenuIndex } = this.data;

      this.setData({ nearbyLoading: true, nearbyFinished: false });
      let res, list;
      switch (curSubMenuIndex) {
        case 0:
          res =
            (await homeService.getNearbyProductList(
              longitude,
              latitude,
              ++this.nearbyPage
            )) || {};
          list = res.list;
          break;

        case 1:
          res =
            (await homeService.getNearbyScenicList({
              longitude,
              latitude,
              page: ++this.nearbyPage,
              radius: 0
            })) || {};
          list = res.list.map(item => ({ ...item, type: 1 }));
          break;

        case 2:
          res =
            (await homeService.getNearbyHotelList({
              longitude,
              latitude,
              page: ++this.nearbyPage,
              radius: 0
            })) || {};
          list = res.list.map(item => ({ ...item, type: 2 }));
          break;

        case 3:
          res =
            (await homeService.getNearbyRestaurantList({
              longitude,
              latitude,
              page: ++this.nearbyPage,
              radius: 0
            })) || {};
          list = res.list.map(item => ({ ...item, type: 3 }));
          break;
      }

      if (init) {
        this.setData({
          nearbyProductList: list,
          nearbyLoading: false,
          nearbyRefreshing: false
        });
      } else {
        this.setData({
          nearbyProductList: [...nearbyProductList, ...list],
          nearbyLoading: false
        });
      }
      if (!list.length) {
        this.setData({ nearbyFinished: true });
      }
    },

    onPageScroll(e) {
      const { scrollTop } = e.detail;
      const { scrolling, navBarActive, curMenuIndex } = this.data;

      if (!scrolling) {
        this.setData({ scrolling: true });
      }

      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.scrollTimer = setTimeout(() => {
        this.setData({ scrolling: false });
      }, 2000);

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

    bannerChange(e) {
      this.setData({
        curDot: e.detail.current
      });
    },

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

    openLocationSetting() {
      wx.openSetting({
        success: async () => {
          await homeService.getLocationInfo();
          this.setList(SCENE_REFRESH);
        }
      });
    },

    hideAdModal() {
      this.setData({
        adModalVisible: false
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
              url: `/pages/subpages/common/webview/index?url=${param}`
            });
            break;
          case 6:
            wx.navigateTo({ url: param });
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
      const url = `/pages/subpages/home/theme/${pathList[index]}/index`;
      wx.navigateTo({ url });
    },

    checkPromoter() {
      wx.navigateTo({
        url: "/pages/subpages/common/promoter/index"
      });
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
