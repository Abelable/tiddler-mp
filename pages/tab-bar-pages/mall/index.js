import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";
import MallService from "./utils/mallService";

const mallService = new MallService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo", "superiorInfo"]
  },

  data: {
    statusBarHeight,
    categoryList: [
      { name: "景点乐园", icon: "scenic" },
      { name: "酒店民宿", icon: "hotel" },
      { name: "餐饮美食", icon: "food" },
      { name: "特色商品", icon: "goods" }
    ],
    pageLoaded: false,
    navBarActive: false,
    bannerList: [],
    curDot: 0,
    productList: [],
    loading: false,
    finished: false
  },

  pageLifetimes: {
    show() {
      store.setTabType("mall");
    }
  },

  methods: {
    async onLoad() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });

      if (!store.locationInfo) {
        mallService.getLocationInfo();
      }
      if (!store.checkInDate) {
        this.initCalendar();
      }

      await this.setBannerList();
      this.setData({ pageLoaded: true });
      if (!this.data.productList.length) {
        this.setProductList(true);
      }
    },

    initCalendar() {
      store.setCheckInDate(new Date().getTime());

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      store.setCheckOutDate(endDate.getTime());
    },

    async setBannerList() {
      const bannerList = await mallService.getBannerList(3);
      this.setData({ bannerList });
    },

    async setProductList(init = false) {
      const limit = 10;
      if (init) {
        this.page = 0;
        this.setData({ productList: [], finished: false });
      }
      const { productList } = this.data;
      this.setData({ loading: true });
      const { list = [] } =
        (await mallService.getProductList(++this.page, limit)) || {};
      this.setData({
        productList: init ? list : [...productList, ...list],
        loading: false
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
      this.setProductList();
    },

    onPullDownRefresh() {
      this.setBannerList();
      this.setProductList(true);
      wx.stopPullDownRefresh();
    },

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

    navTo(e) {
      const pageList = [
        "/pages/subpages/mall/scenic/index",
        "/pages/subpages/mall/hotel/index",
        "/pages/subpages/mall/catering/index",
        "/pages/subpages/mall/goods/index"
      ];
      wx.navigateTo({
        url: pageList[Number(e.currentTarget.dataset.index)]
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

    onShareAppMessage() {
      const { id } = store.superiorInfo || {};
      const path = id
        ? `/pages/tab-bar-pages/mall/index?superiorId=${id}`
        : "/pages/tab-bar-pages/mall/index";
      return { path };
    },

    onShareTimeline() {
      const { id } = store.superiorInfo || {};
      const query = id ? `superiorId=${id}` : "";
      return { query };
    }
  }
});
