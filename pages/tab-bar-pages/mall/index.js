import { WEBVIEW_BASE_URL } from "../../../config";
import { store } from "../../../store/index";
import MallService from "./utils/mallService";

const mallService = new MallService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  data: {
    statusBarHeight,
    categoryList: [
      { name: "景点乐园", icon: "scenic" },
      { name: "酒店民宿", icon: "hotel" },
      { name: "餐厅美食", icon: "food" },
      { name: "特色商品", icon: "goods" }
    ],
    navBarActive: false,
    commodityList: [],
    finished: false
  },

  pageLifetimes: {
    show() {
      store.setTabType("mall");
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
          const superiorInfo = await mallService.getSuperiorInfo(
            this.superiorId
          );
          store.setPromoterInfo(superiorInfo);
        }
      });

      if (!store.locationInfo) {
        mallService.getLocationInfo();
      }
      this.initCalendar();
      this.setBannerList();
      if (!this.data.commodityList.length) {
        this.setCommodityList(true);
      }

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

    async setBannerList() {
      const bannerList = await mallService.getBannerList();
      this.setData({ bannerList });
    },

    async setCommodityList(init = false) {
      const limit = 10;
      if (init) {
        this.page = 0;
        this.setData({ finished: false });
      }
      const { commodityList } = this.data;
      const { list = [] } =
        (await mallService.getCommodityList(++this.page, limit)) || {};
      this.setData({
        commodityList: init ? list : [...commodityList, ...list]
      });
      if (list.length < limit) {
        this.setData({ finished: true });
      }
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
    },

    onReachBottom() {
      this.setCommodityList();
    },

    onPullDownRefresh() {
      this.setCommodityList(true);
      wx.stopPullDownRefresh();
    },

    search() {
      wx.navigateTo({
        url: "/pages/subpages/common/search/index"
      });
    },

    navTo(e) {
      const pageList = [
        "/pages/subpages/mall/scenic-spot/index",
        "/pages/subpages/mall/hotel/index",
        "/pages/subpages/mall/catering/index",
        "/pages/subpages/mall/goods/index"
      ];
      wx.navigateTo({
        url: pageList[Number(e.currentTarget.dataset.index)]
      });
    },

    linkTo(e) {
      const { scene, param } = e.currentTarget.dataset;
      switch (scene) {
        case 1:
          wx.navigateTo({
            url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}${param}`
          });
          break;

        case 2:
          wx.navigateTo({
            url: `/pages/subpages/mall/scenic-spot/subpages/spot-detail/index?id=${param}`
          });
          break;

        case 3:
          wx.navigateTo({
            url: `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${param}`
          });
          break;

        case 4:
          wx.navigateTo({
            url: `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${param}`
          });
          break;

        case 5:
          wx.navigateTo({
            url: `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${param}`
          });
          break;
      }
    },

    onShareAppMessage() {
      const { id } = store.promoterInfo || {};
      const path = id
        ? `/pages/tab-bar-pages/mall/index?superiorId=${id}`
        : "/pages/tab-bar-pages/mall/index";
      return { path };
    },

    onShareTimeline() {
      const { id } = store.promoterInfo || {};
      const query = id ? `superiorId=${id}` : "";
      return { query };
    }
  }
});
