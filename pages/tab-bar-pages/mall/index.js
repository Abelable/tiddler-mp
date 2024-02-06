import { store } from "../../../store/index";
import MallService from "./utils/mallService";

const mallService = new MallService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  data: {
    statusBarHeight,
    categoryList: [
      { name: "景点玩乐", icon: "https://img.ubo.vip/tiddler/mall/scenic.png" },
      { name: "酒店民宿", icon: "https://img.ubo.vip/tiddler/mall/hotel.png" },
      { name: "美食小吃", icon: "https://img.ubo.vip/tiddler/mall/food.png" },
      {
        name: "特色商品",
        icon: "https://img.ubo.vip/tiddler/mall/shopping.png",
      },
    ],
    navBarActive: false,
    commodityList: [],
    finished: false,
  },

  pageLifetimes: {
    show() {
      store.setTabType("mall");

      this.setLocationInfo();
      this.initCalendar();
      if (!this.data.commodityList.length) {
        this.setCommodityList(true);
      }
    },
  },

  methods: {
    async setLocationInfo() {
      const { authSetting } = await mallService.getSetting();
      if (authSetting["scope.userLocation"] !== false) {
        const { longitude, latitude } = await mallService.getLocation();
        store.setLocationInfo({ longitude, latitude });
      }
    },

    initCalendar() {
      store.setCheckInDate(new Date().getTime());
  
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      store.setCheckOutDate(endDate.getTime());
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
        commodityList: init ? list : [...commodityList, ...list],
      });
      if (list.length < limit) {
        this.setData({ finished: true });
      }
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
        url: "/pages/subpages/mall/search/index",
      });
    },

    navTo(e) {
      const pageList = [
        "/pages/subpages/mall/scenic-spot/index",
        "/pages/subpages/mall/hotel/index",
        "/pages/subpages/mall/catering/index",
        "/pages/subpages/mall/goods/index",
      ];
      wx.navigateTo({
        url: pageList[Number(e.currentTarget.dataset.index)],
      });
    },

    navToMessageCenter() {
      wx.navigateTo({
        url: "/pages/subpages/message-center/index",
      });
    },
  },
});
