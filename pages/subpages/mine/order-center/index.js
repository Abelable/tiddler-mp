const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIndex: 0,
    curSubMenuIndex: 0,
    menuList: [
      {
        name: "景点",
        subMenuList: [
          { name: "全部", status: 0 },
          { name: "待付款", status: 1 },
          { name: "待出行", status: 2 },
          { name: "待评价", status: 3 },
          { name: "售后", status: 4 }
        ]
      },
      {
        name: "酒店",
        subMenuList: [
          { name: "全部", status: 0 },
          { name: "待付款", status: 1 },
          { name: "待商家确认", status: 2 },
          { name: "待入住", status: 3 },
          { name: "待评价", status: 4 },
          { name: "售后", status: 5 }
        ]
      },
      {
        name: "餐券",
        subMenuList: [
          { name: "全部", status: 0 },
          { name: "待付款", status: 1 },
          { name: "待使用", status: 2 },
          { name: "待评价", status: 3 },
          { name: "售后", status: 4 }
        ]
      },
      {
        name: "套餐",
        subMenuList: [
          { name: "全部", status: 0 },
          { name: "待付款", status: 1 },
          { name: "待使用", status: 2 },
          { name: "待评价", status: 3 },
          { name: "售后", status: 4 }
        ]
      },
      {
        name: "商品",
        subMenuList: [
          { name: "全部", status: 0 },
          { name: "待付款", status: 1 },
          { name: "待发货", status: 2 },
          { name: "待收货/使用", status: 3 },
          { name: "评价", status: 4 },
          { name: "售后", status: 5 }
        ]
      }
    ]
  },

  selectMenu(e) {
    const { index: curMenuIndex } = e.currentTarget.dataset;
    this.setData({ curMenuIndex });
    // this.setOrderList(true);
  },

  selectSubMenu(e) {
    const { index: curSubMenuIndex } = e.currentTarget.dataset;
    this.setData({ curSubMenuIndex });
    // this.setOrderList(true);
  },

  navigateBack() {
    wx.switchTab({
      url: "/pages/tab-bar-pages/mine/index",
    });
  }
});
