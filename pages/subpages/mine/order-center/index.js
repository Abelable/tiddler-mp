const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    menuList: [
      { name: "景点", status: 0 },
      { name: "酒店", status: 1 },
      { name: "餐券", status: 2 },
      { name: "套餐", status: 3 },
      { name: "商品", status: 4 }
    ],
    curMenuIndex: 0,
    subMenuList: [
      { name: "全部", status: 0 },
      { name: "待付款", status: 1 },
      { name: "待发货", status: 2 },
      { name: "待收货/使用", status: 3 },
      { name: "评价", status: 4 },
      { name: "售后", status: 5 }
    ],
    curSubMenuIndex: 0,
  }
});
