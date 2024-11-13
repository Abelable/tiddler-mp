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
const { statusBarHeight, windowHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"]
  },

  data: {
    statusBarHeight,
    navBarActive: false,
    wrapHeightList: [windowHeight, windowHeight],
    curMenuIndex: 1,
    followMediaList: [],
    followFinished: false,
    topMediaList: [],
    mediaList: [],
    finished: false
  },

  pageLifetimes: {
    show() {
      store.setTabType("home");
    }
  },

  methods: {
    onLoad() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });

      this.scrollTopArr = [0, 0];
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });

      if (!store.locationInfo) {
        homeService.getLocationInfo();
      }
      this.initCalendar();

      this.setList(SCENE_REFRESH);
    },

    initCalendar() {
      store.setCheckInDate(new Date().getTime());

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      store.setCheckOutDate(endDate.getTime());
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
        this.setData({ curMenuIndex: index }, () => {
          this.setList(SCENE_SWITCH_TAB);
        });
        this.scrollTopArr[curMenuIndex] = this.scrollTop || 0;
        wx.pageScrollTo({
          scrollTop: this.scrollTopArr[index] || 0,
          duration: 0
        });
      }
    },

    onPullDownRefresh() {
      this.setList(SCENE_REFRESH);
      wx.stopPullDownRefresh();
    },

    onReachBottom() {
      this.setList(SCENE_LOADMORE);
    },

    setList(scene) {
      const { curMenuIndex, followMediaList, mediaList } = this.data;
      switch (scene) {
        case SCENE_SWITCH_TAB:
          if (curMenuIndex === 0) {
            if (!followMediaList.length) this.setFollowMediaList(true);
          } else {
            if (!mediaList.length) this.setMediaList(true);
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

    setFollowMediaList(init = false) {
      checkLogin(async () => {
        if (init) {
          this.followPage = 0;
          this.setData({ followFinished: false });
        }
        const { followFinished, followMediaList } = this.data;

        if (!followFinished) {
          const { list = [] } =
            (await homeService.getFollowMediaList(++this.followPage)) || {};
          this.setData(
            {
              followMediaList: init ? list : [...followMediaList, ...list]
            },
            () => {
              this.setWrapHeight();
            }
          );
          if (!list.length) {
            this.setData({ followFinished: true });
          }
        }
      }, false);
    },

    async setMediaList(init = false) {
      if (init) {
        this.page = 0;
        this.setData({ finished: false });
      }
      const { finished, mediaList } = this.data;

      if (!finished) {
        const { list = [] } =
          (await homeService.getMediaList(++this.page)) || {};
        if (init) {
          const topMediaList = [];
          const filterMediaList = [];
          list.forEach(item => {
            if (item.type === 3 && topMediaList.length < 5) {
              topMediaList.push(item);
            } else {
              filterMediaList.push(item);
            }
          });
          this.setData({
            topMediaList,
            mediaList: filterMediaList
          });
        } else {
          this.setData({
            mediaList: [...mediaList, ...list]
          });
        }

        if (!list.length) {
          this.setData({ finished: true });
        }
      }
    },

    setWrapHeight() {
      const { curMenuIndex } = this.data;
      const query = wx.createSelectorQuery();
      query.selectAll(".content-wrap").boundingClientRect();
      query.exec(res => {
        if (res[0][curMenuIndex]) {
          const { height } = res[0][curMenuIndex];
          this.setData({
            [`wrapHeightList[${curMenuIndex}]`]:
              height < windowHeight ? windowHeight : height
          });
        }
      });
    },

    onPageScroll(e) {
      if (e.scrollTop >= 10) {
        if (!this.data.navBarActive) {
          this.setData({
            navBarActive: true
          });
        }
      } else {
        if (this.data.navBarActive) {
          this.setData({
            navBarActive: false
          });
        }
      }

      this.scrollTop = e.scrollTop;
      if (this.data.curMenuIndex === 1) {
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

    navToMessageCenter() {
      wx.navigateTo({
        url: "/pages/subpages/message-center/index"
      });
    },

    register() {
      wx.navigateTo({
        url: "/pages/subpages/common/register/index"
      });
    },

    onShareAppMessage() {},

    onShareTimeline() {}
  }
});
