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
      { name: "特色商品", icon: "https://img.ubo.vip/tiddler/mall/shopping.png" },
    ],
    navBarActive: false,
  },

  pageLifetimes: {
    show() {
      store.setTabType("mall");
    },
  },

  methods: {
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

    onReachBottom() {},

    onPullDownRefresh() {
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
        "/pages/subpages/mall/foot/index",
        "/pages/subpages/mall/goods/index",
      ];
      wx.navigateTo({
        url: pageList[Number(e.currentTarget.dataset.index)],
      });
    },
  },
});
