import { store } from "../../../../store/index";
import OrderService from "./utils/orderService";

const orderService = new OrderService();
const { statusBarHeight } = getApp().globalData.systemInfo;
const menuList = [
  {
    name: "景点",
    total: 0,
    curSubMenuIdx: 0,
    subMenuList: [
      { name: "全部", status: 0 },
      { name: "待付款", status: 1, total: 0 },
      { name: "待商家确认", status: 2, total: 0 },
      { name: "待出行", status: 3, total: 0 },
      { name: "待评价", status: 4, total: 0 },
      { name: "售后", status: 5, total: 0 }
    ]
  },
  {
    name: "酒店",
    curSubMenuIdx: 0,
    subMenuList: [
      { name: "全部", status: 0 },
      { name: "待付款", status: 1, total: 0 },
      { name: "待商家确认", status: 2, total: 0 },
      { name: "待入住", status: 3, total: 0 },
      { name: "待评价", status: 4, total: 0 },
      { name: "售后", status: 5, total: 0 }
    ]
  },
  {
    name: "餐券",
    curSubMenuIdx: 0,
    subMenuList: [
      { name: "全部", status: 0 },
      { name: "待付款", status: 1, total: 0 },
      { name: "待商家确认", status: 2, total: 0 },
      { name: "待使用", status: 3, total: 0 },
      { name: "待评价", status: 4, total: 0 },
      { name: "售后", status: 5, total: 0 }
    ]
  },
  {
    name: "套餐",
    curSubMenuIdx: 0,
    subMenuList: [
      { name: "全部", status: 0 },
      { name: "待付款", status: 1, total: 0 },
      { name: "待商家确认", status: 2, total: 0 },
      { name: "待使用", status: 3, total: 0 },
      { name: "待评价", status: 4, total: 0 },
      { name: "售后", status: 5, total: 0 }
    ]
  },
  {
    name: "商品",
    curSubMenuIdx: 0,
    subMenuList: [
      { name: "全部", status: 0 },
      { name: "待付款", status: 1, total: 0 },
      { name: "待发货", status: 2, total: 0 },
      { name: "待收货/使用", status: 3, total: 0 },
      { name: "评价", status: 4, total: 0 },
      { name: "售后", status: 5, total: 0 }
    ]
  }
];

Page({
  data: {
    statusBarHeight,
    menuList: [],
    curMenuIdx: 0,
    scenicOrderList: [],
    scenicFinished: false,
    hotelOrderList: [],
    hotelFinished: false,
    mealTicketOrderList: [],
    mealTicketFinished: false,
    setMealOrderList: [],
    setMealFinished: false,
    goodsOrderList: [],
    goodsFinished: false,
    verifyCode: "",
    qrCodeModalVisible: false
  },

  onLoad({ type = "1", status = "0" }) {
    this.initMenu(type, status);
    this.setOrderList(true);
  },

  onShow() {
    if (this.loaded) {
      this.init();
    } else {
      this.loaded = true;
    }
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
    this.setOrderList(true);
  },

  selectSubMenu(e) {
    const { curMenuIdx } = this.data;
    const { index: curSubMenuIdx } = e.currentTarget.dataset;
    this.setData({
      [`menuList[${curMenuIdx}].curSubMenuIdx`]: curSubMenuIdx
    });
    this.setOrderList(true);
  },

  onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setOrderList();
  },

  init() {
    this.setOrderTotal();
    this.setOrderList(true);
  },

  initMenu(type, status) {
    this.menuList = menuList;

    const {
      scenicOrderTotal,
      hotelOrderTotal,
      mealTicketOrderTotal,
      setMealOrderTotal,
      goodsOrderTotal
    } = store;
    this.setMenuTotal(scenicOrderTotal, 0);
    this.setMenuTotal(hotelOrderTotal, 1);
    this.setMenuTotal(mealTicketOrderTotal, 2);
    this.setMenuTotal(setMealOrderTotal, 3);
    this.setMenuTotal(goodsOrderTotal, 4);

    const curMenuIdx = type - 1;
    const curSubMenuIdx = this.menuList.findIndex(
      item => item.status === Number(status)
    );

    this.setData({ menuList: this.menuList, curMenuIdx, curSubMenuIdx });
  },

  async setOrderTotal() {
    const { curMenuIdx } = this.data;
    let orderTotal = [];
    switch (curMenuIdx) {
      case 0:
        orderTotal = await orderService.getScenicOrderTotal();
        break;
      case 1:
        orderTotal = await orderService.getHotelOrderTotal();
        break;
      case 2:
        orderTotal = await orderService.getMealTicketOrderTotal();
        break;
      case 3:
        orderTotal = await orderService.getSetMealOrderTotal();
        break;
      case 4:
        orderTotal = await orderService.getGoodsOrderTotal();
        break;
    }
    this.setMenuTotal(orderTotal, curMenuIdx);
    this.setData({ menuList: this.menuList });
  },

  async setMenuTotal(orderTotal, curMenuIdx) {
    if (orderTotal.length) {
      this.menuList[curMenuIdx].total = orderTotal.reduce(
        (sum, total) => sum + total,
        0
      );
      this.menuList[curMenuIdx].subMenuList[1].total = orderTotal[0];
      this.menuList[curMenuIdx].subMenuList[2].total = orderTotal[1];
      this.menuList[curMenuIdx].subMenuList[3].total = orderTotal[2];
      this.menuList[curMenuIdx].subMenuList[4].total = orderTotal[3];
      if ([0, 1, 4].includes(curMenuIdx)) {
        this.menuList[curMenuIdx].subMenuList[5].total = orderTotal[4];
      }
    }
  },

  setOrderList(init = false) {
    const { curMenuIdx } = this.data;
    switch (curMenuIdx) {
      case 0:
        this.setScenicOrderList(init);
        break;
      case 1:
        this.setHotelOrderList(init);
        break;
      case 2:
        this.setMealTicketOrderList(init);
        break;
      case 3:
        this.setSetMealOrderList(init);
        break;
      case 4:
        this.setGoodsOrderList(init);
        break;
    }
  },

  async setScenicOrderList(init) {
    const limit = 10;
    const { menuList, scenicOrderList } = this.data;
    const { subMenuList, curSubMenuIdx } = menuList[0];
    if (init) {
      this.scenicPage = 0;
      this.setData({ scenicFinished: false });
    }
    const list = await orderService.getScenicOrderList({
      status: subMenuList[curSubMenuIdx].status,
      page: ++this.scenicPage,
      limit
    });
    this.setData({
      scenicOrderList: init ? list : [...scenicOrderList, ...list]
    });
    if (list.length < limit) {
      this.setData({ scenicFinished: true });
    }
  },

  async setHotelOrderList(init) {
    const limit = 10;
    const { menuList, hotelOrderList } = this.data;
    const { subMenuList, curSubMenuIdx } = menuList[1];
    if (init) {
      this.hotelPage = 0;
      this.setData({ hotelFinished: false });
    }
    const list = await orderService.getHotelOrderList({
      status: subMenuList[curSubMenuIdx].status,
      page: ++this.hotelPage,
      limit
    });
    this.setData({
      hotelOrderList: init ? list : [...hotelOrderList, ...list]
    });
    if (list.length < limit) {
      this.setData({ hotelFinished: true });
    }
  },

  async setMealTicketOrderList(init) {
    const limit = 10;
    const { menuList, mealTicketOrderList } = this.data;
    const { subMenuList, curSubMenuIdx } = menuList[2];
    if (init) {
      this.mealTicketPage = 0;
      this.setData({ mealTicketFinished: false });
    }
    const list = await orderService.getMealTicketOrderList({
      status: subMenuList[curSubMenuIdx].status,
      page: ++this.mealTicketPage,
      limit
    });
    this.setData({
      mealTicketOrderList: init ? list : [...mealTicketOrderList, ...list]
    });
    if (list.length < limit) {
      this.setData({ mealTicketFinished: true });
    }
  },

  async setSetMealOrderList(init) {
    const limit = 10;
    const { menuList, setMealOrderList } = this.data;
    const { subMenuList, curSubMenuIdx } = menuList[3];
    if (init) {
      this.setMealPage = 0;
      this.setData({ setMealFinished: false });
    }
    const list = await orderService.getSetMealOrderList({
      status: subMenuList[curSubMenuIdx].status,
      page: ++this.setMealPage,
      limit
    });
    this.setData({
      setMealOrderList: init ? list : [...setMealOrderList, ...list]
    });
    if (list.length < limit) {
      this.setData({ setMealFinished: true });
    }
  },

  async setGoodsOrderList(init) {
    const limit = 10;
    const { menuList, goodsOrderList } = this.data;
    const { subMenuList, curSubMenuIdx } = menuList[4];
    if (init) {
      this.goodsPage = 0;
      this.setData({ goodsOrderList: [], goodsFinished: false });
    }
    const list = await orderService.getGoodsOrderList({
      status: subMenuList[curSubMenuIdx].status,
      page: ++this.goodsPage,
      limit
    });
    this.setData({
      goodsOrderList: init ? list : [...goodsOrderList, ...list]
    });
    if (list.length < limit) {
      this.setData({ goodsFinished: true });
    }
  },

  showQRcodeModal(e) {
    const { verifyCode } = e.detail;
    this.setData({
      verifyCode,
      qrCodeModalVisible: true
    });
  },

  hideQRcodeModal() {
    this.setData({
      qrCodeModalVisible: false
    });
    this.setOrderList(true);
  },

  navigateBack() {
    wx.switchTab({
      url: "/pages/tab-bar-pages/mine/index"
    });
  },

  search() {
    const { curMenuIdx } = this.data;
    const url = `./subpages/order-search/index?type=${curMenuIdx + 1}`;
    wx.navigateTo({ url });
  }
});
