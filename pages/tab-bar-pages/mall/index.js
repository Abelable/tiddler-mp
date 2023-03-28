import { store } from "../../../store/index";
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  data: {
    statusBarHeight,
    categoryList: [
      { name: "景点门票", icon: "./images/ticket.png" },
      { name: "酒店民宿", icon: "./images/hotel.png" },
      { name: "餐饮美食", icon: "./images/foot.png" },
      { name: "特色商品", icon: "./images/cart.png" },
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
        "/pages/subpages/mall/ticket/index",
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
