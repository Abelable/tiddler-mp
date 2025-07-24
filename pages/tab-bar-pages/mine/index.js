import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";
import { checkLogin } from "../../../utils/index";
import MineService from "./utils/mineService";
import {
  SCENE_SWITCH_TAB,
  SCENE_REFRESH,
  SCENE_LOADMORE
} from "../../../utils/emuns/listScene";

const mineService = new MineService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo", "superiorInfo"]
  },

  data: {
    statusBarHeight,
    toolList: [
      { name: "订单中心", icon: "order" },
      { name: "收货地址", icon: "address" },
      { name: "优惠券", icon: "coupon" },
      { name: "浏览历史", icon: "history" },
      { name: "更多设置", icon: "setting" }
    ],
    showAllTools: false,
    orderTotal: 0,
    navBarVisible: false,
    menuFixed: false,
    curMenuIndex: 0,
    wrapHeightList: [500, 500, 500, 500],
    videoListTotal: 0,
    videoList: [],
    videoLoading: false,
    videoFinished: false,
    noteListTotal: 0,
    noteList: [],
    noteLoading: false,
    noteFinished: false,
    collectMediaList: [],
    collectLoading: false,
    collectFinished: false,
    likeMediaList: [],
    likeLoading: false,
    likeFinished: false,
    authInfoPopupVisible: false
  },

  observers: {
    userInfo: function (userInfo) {
      if (userInfo) {
        const { avatar = "" } = store.userInfo || {};
        if (
          (!avatar || avatar.includes("default_avatar")) &&
          !this.authInfoPopupShown
        ) {
          this.setData({ authInfoPopupVisible: true });
          this.authInfoPopupShown = true;
        }

        this.initToolList();
      }
    }
  },

  lifetimes: {
    attached() {
      this.setNavBarVisibleLimit();
      this.setMenuFixedLimit();
    }
  },

  pageLifetimes: {
    show() {
      store.setTabType("mine");

      checkLogin(() => {
        this.init();
      }, false);
    }
  },

  methods: {
    init() {
      this.scrollTopArr = [0, 0, 0, 0];
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });

      this.updateUserInfo();
      this.updateOrderTotal();

      this.setList(SCENE_REFRESH);
    },

    updateUserInfo() {
      mineService.getMyInfo();
    },

    async updateOrderTotal() {
      const scenicOrderTotals = await mineService.getScenicOrderTotal();
      const scenicOrderTotal = scenicOrderTotals.reduce(
        (sum, total) => sum + total,
        0
      );
      const hotelOrderTotals = await mineService.getHotelOrderTotal();
      const hotelOrderTotal = hotelOrderTotals.reduce(
        (sum, total) => sum + total,
        0
      );
      const mealTicketOrderTotals = await mineService.getMealTicketOrderTotal();
      const mealTicketOrderTotal = mealTicketOrderTotals.reduce(
        (sum, total) => sum + total,
        0
      );
      const setMealOrderTotals = await mineService.getSetMealOrderTotal();
      const setMealOrderTotal = setMealOrderTotals.reduce(
        (sum, total) => sum + total,
        0
      );
      const goodsOrderTotals = await mineService.getGoodsOrderTotal();
      const goodsOrderTotal = goodsOrderTotals.reduce(
        (sum, total) => sum + total,
        0
      );
      this.setData({
        orderTotal:
          scenicOrderTotal +
          hotelOrderTotal +
          mealTicketOrderTotal +
          setMealOrderTotal +
          goodsOrderTotal
      });
    },

    initToolList() {
      const {
        promoterInfo,
        authInfoId,
        scenicShopId,
        scenicShopManagerList,
        hotelShopId,
        hotelShopManagerList,
        cateringShopId,
        cateringShopManagerList,
        shopId,
        shopManagerList
      } = store.userInfo || {};

      const toolList = [
        { name: "订单中心", icon: "order" },
        { name: "收货地址", icon: "address" },
        promoterInfo ? { name: "代言奖励", icon: "promoter" } : undefined,
        scenicShopId ||
        scenicShopManagerList.findIndex(item => item.roleId !== 3) !== -1 ||
        hotelShopId ||
        hotelShopManagerList.findIndex(item => item.roleId !== 3) !== -1 ||
        cateringShopId ||
        cateringShopManagerList.findIndex(item => item.roleId !== 3) !== -1 ||
        shopId ||
        shopManagerList.findIndex(item => item.roleId !== 3) !== -1
          ? { name: "商家中心", icon: "merchant" }
          : undefined,
        scenicShopId ||
        scenicShopManagerList.length ||
        hotelShopId ||
        hotelShopManagerList.length ||
        cateringShopId ||
        cateringShopManagerList.length ||
        shopId ||
        shopManagerList.length
          ? { name: "扫码核销", icon: "scan" }
          : undefined,
        promoterInfo || scenicShopId || hotelShopId || cateringShopId || shopId
          ? { name: "我的余额", icon: "balance" }
          : undefined,
        { name: "优惠券", icon: "coupon" },
        { name: "浏览历史", icon: "history" },
        authInfoId ? { name: "我的直播", icon: "live" } : undefined,
        { name: "更多设置", icon: "setting" }
      ].filter(item => !!item);
      this.setData({ toolList });
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
        checkLogin(() => {
          this.setList(SCENE_SWITCH_TAB);
          this.scrollTopArr[curMenuIndex] = this.scrollTop || 0;
          wx.pageScrollTo({
            scrollTop: this.scrollTopArr[index] || 0,
            duration: 0
          });
        }, false);
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
      const {
        curMenuIndex,
        videoList,
        noteList,
        collectMediaList,
        likeMediaList
      } = this.data;
      switch (scene) {
        case SCENE_SWITCH_TAB:
          switch (curMenuIndex) {
            case 0:
              if (!videoList.length) this.setVideoList(true);
              break;

            case 1:
              if (!noteList.length) this.setNoteList(true);
              break;

            case 2:
              if (!collectMediaList.length) this.setCollectMediaList(true);
              break;

            case 3:
              if (!likeMediaList.length) this.setLikeMediaList(true);
              break;
          }
          break;

        case SCENE_REFRESH:
          switch (curMenuIndex) {
            case 0:
              this.setVideoList(true);
              break;

            case 1:
              this.setNoteList(true);
              break;

            case 2:
              this.setCollectMediaList(true);
              break;

            case 3:
              this.setLikeMediaList(true);
              break;
          }
          break;

        case SCENE_LOADMORE:
          switch (curMenuIndex) {
            case 0:
              this.setVideoList();
              break;

            case 1:
              this.setNoteList();
              break;

            case 2:
              this.setCollectMediaList();
              break;

            case 3:
              this.setLikeMediaList();
              break;
          }
          break;
      }
    },

    async setVideoList(init = false) {
      if (init) {
        this.videoPage = 0;
        this.setData({ videoList: [], videoFinished: false });
      }
      const { videoList } = this.data;

      this.setData({ videoLoading: true });
      const { list = [], total = 0 } =
        (await mineService.getUserVideoList({
          page: ++this.videoPage
        })) || {};
      this.setData({
        videoList: init ? list : [...videoList, ...list],
        videoLoading: false
      });
      if (init) {
        this.setData({ videoListTotal: total });
      }
      if (!list.length) {
        this.setData({ videoFinished: true });
      }
    },

    async setNoteList(init = false) {
      if (init) {
        this.notePage = 0;
        this.setData({ noteList: [], noteFinished: false });
      }
      const { noteList } = this.data;

      this.setData({ noteLoading: true });
      const { list = [], total = 0 } =
        (await mineService.getUserNoteList({ page: ++this.notePage })) || {};
      this.setData({
        noteList: init ? list : [...noteList, ...list],
        noteLoading: false
      });
      if (init) {
        this.setData({ noteListTotal: total });
      }
      if (!list.length) {
        this.setData({ noteFinished: true });
      }
    },

    async setCollectMediaList(init = false) {
      if (init) {
        this.collectPage = 0;
        this.setData({ collectMediaList: [], collectFinished: false });
      }
      const { collectMediaList } = this.data;

      this.setData({ collectLoading: true });
      const { list = [] } =
        (await mineService.getUserCollectMediaList(++this.collectPage)) || {};
      this.setData({
        collectMediaList: init ? list : [...collectMediaList, ...list],
        collectLoading: false
      });
      if (!list.length) {
        this.setData({ collectFinished: true });
      }
    },

    async setLikeMediaList(init = false) {
      if (init) {
        this.likePage = 0;
        this.setData({ likeMediaList: [], likeFinished: false });
      }
      const { likeMediaList } = this.data;

      this.setData({ likeLoading: true });
      const { list = [] } =
        (await mineService.getUserLikeMediaList(++this.likePage)) || {};
      this.setData({
        likeMediaList: init ? list : [...likeMediaList, ...list],
        likeLoading: false
      });
      if (!list.length) {
        this.setData({ likeFinished: true });
      }
    },

    setNavBarVisibleLimit() {
      const query = wx.createSelectorQuery();
      query.select(".name").boundingClientRect();
      query.exec(res => {
        this.navBarVisibleLimit = res[0].bottom;
      });
    },

    setMenuFixedLimit() {
      const query = wx.createSelectorQuery();
      query.select(".works-menu").boundingClientRect();
      query.exec(res => {
        this.menuFixedLimit = res[0].top - statusBarHeight - 44;
      });
    },

    setWrapHeight() {
      const { curMenuIndex } = this.data;
      const query = wx.createSelectorQuery();
      query.selectAll(".content-wrap").boundingClientRect();
      query.exec(res => {
        if (res[0][curMenuIndex]) {
          const { height } = res[0][curMenuIndex];
          this.setData({
            [`wrapHeightList[${curMenuIndex}]`]: height < 400 ? 400 : height
          });
        }
      });
    },

    onPageScroll(e) {
      if (e.scrollTop >= this.navBarVisibleLimit) {
        !this.data.navBarVisible &&
          this.setData({
            navBarVisible: true
          });
      } else {
        this.data.navBarVisible &&
          this.setData({
            navBarVisible: false
          });
      }

      if (e.scrollTop >= this.menuFixedLimit) {
        !this.data.menuFixed &&
          this.setData({
            menuFixed: true
          });
      } else {
        this.data.menuFixed &&
          this.setData({
            menuFixed: false
          });
      }

      this.scrollTop = e.scrollTop;
    },

    toggleToolsVisible() {
      this.setData({
        showAllTools: !this.data.showAllTools
      });
    },

    navTo(e) {
      const { type } = e.currentTarget.dataset;
      if (type === "live") {
        this.navToLive();
      } else if (type === "scan") {
        this.scan();
      } else {
        if (type === "setting") {
          wx.navigateTo({
            url: `/pages/subpages/mine/${type}/index`
          });
        } else {
          checkLogin(() => {
            wx.navigateTo({
              url: `/pages/subpages/mine/${type}/index`
            });
          }, true);
        }
      }
    },

    scan() {
      const {
        scenicShopId,
        scenicShopManagerList,
        hotelShopId,
        hotelShopManagerList,
        cateringShopId,
        cateringShopManagerList,
        shopId,
        shopManagerList
      } = store.userInfo;
      wx.scanCode({
        success: res => {
          const code = res.result;
          if (code.length === 12) {
            if (scenicShopId || scenicShopManagerList.length) {
              mineService.verifyScenicCode(code, () => {
                wx.showToast({
                  title: "核销成功",
                  icon: "none"
                });
              });
            } else {
              wx.showToast({
                title: "暂无核销权限",
                icon: "none"
              });
            }
          }
          if (code.length === 11) {
            if (hotelShopId || hotelShopManagerList.length) {
              mineService.verifyHotelCode(code, () => {
                wx.showToast({
                  title: "核销成功",
                  icon: "none"
                });
              });
            } else {
              wx.showToast({
                title: "暂无核销权限",
                icon: "none"
              });
            }
          }
          if (code.length === 10) {
            if (cateringShopId || cateringShopManagerList.length) {
              mineService.verifyMealTicketCode(code, () => {
                wx.showToast({
                  title: "核销成功",
                  icon: "none"
                });
              });
            } else {
              wx.showToast({
                title: "暂无核销权限",
                icon: "none"
              });
            }
          }
          if (code.length === 9) {
            if (cateringShopId || cateringShopManagerList.length) {
              mineService.verifySetMealCode(code, () => {
                wx.showToast({
                  title: "核销成功",
                  icon: "none"
                });
              });
            } else {
              wx.showToast({
                title: "暂无核销权限",
                icon: "none"
              });
            }
          }
          if (code.length === 8) {
            if (shopId || shopManagerList.length) {
              mineService.verifyGoodsCode(code, () => {
                wx.showToast({
                  title: "核销成功",
                  icon: "none"
                });
              });
            } else {
              wx.showToast({
                title: "暂无核销权限",
                icon: "none"
              });
            }
          }
        }
      });
    },

    async navToLive() {
      const statusInfo = await mineService.getRoomStatus();
      if (!statusInfo) {
        wx.navigateTo({
          url: "/pages/subpages/home/media/live/create-live/index"
        });
      } else {
        const { status, direction } = statusInfo;
        const url =
          status === 3
            ? "/pages/subpages/home/media/live/live-notice/index"
            : `/pages/subpages/home/media/live/live-push/${
                direction === 1 ? "vertical" : "horizontal"
              }-screen/index`;
        wx.navigateTo({ url });
      }
    },

    navToVideoCreate() {
      checkLogin(async () => {
        const { tempFilePath } = (await mineService.chooseVideo()) || {};
        if (tempFilePath) {
          const url = `/pages/subpages/mine/create-video/index?tempFilePath=${tempFilePath}`;
          wx.navigateTo({ url });
        }
      });
    },

    navToNoteCreate() {
      checkLogin(() => {
        const url = "/pages/subpages/mine/create-note/index";
        wx.navigateTo({ url });
      });
    },

    navToUserInfoSetting() {
      checkLogin(() => {
        const url =
          "/pages/subpages/mine/setting/subpages/user-info-setting/index";
        wx.navigateTo({ url });
      });
    },

    checkFollowList() {
      checkLogin(() => {
        const url = "/pages/subpages/mine/fan-follow-list/index?scene=1";
        wx.navigateTo({ url });
      });
    },

    checkFanList() {
      checkLogin(() => {
        const url = "/pages/subpages/mine/fan-follow-list/index?scene=2";
        wx.navigateTo({ url });
      });
    },

    register() {
      wx.navigateTo({
        url: "/pages/subpages/common/register/index"
      });
    },

    hideAuthInfoPopup() {
      this.setData({ authInfoPopupVisible: false });
    }
  }
});
