import OrderService from "./utils/orderService";

const orderService = new OrderService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    menuList: [
      {
        name: "景点",
        curSubMenuIdx: 0,
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
        curSubMenuIdx: 0,
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
        curSubMenuIdx: 0,
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
        curSubMenuIdx: 0,
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
        curSubMenuIdx: 0,
        subMenuList: [
          { name: "全部", status: 0 },
          { name: "待付款", status: 1 },
          { name: "待发货", status: 2 },
          { name: "待收货/使用", status: 3 },
          { name: "评价", status: 4 },
          { name: "售后", status: 5 }
        ]
      }
    ],
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
    goodsFinished: false
  },

  async onLoad({ type = "1", status = "0" }) {
    const curMenuIdx = type - 1;
    const curSubMenuIdx = this.data.menuList.findIndex(
      item => item.status === Number(status)
    );
    this.setData({ curMenuIdx, curSubMenuIdx });
  },

  onShow() {
    this.setOrderList(true);
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
    this.setOrderList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setOrderList();
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
      this.setData({ goodsFinished: false });
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

  updateScenicOrderList(e) {
    const statusEmuns = {
      cancel: 102,
      pay: 201,
      refund: 202,
      confirm: 401
    };
    const { type, index } = e.detail;
    const { menuList, scenicOrderList } = this.data;
    const { curSubMenuIdx } = menuList[0];
    if (type === "delete" || curSubMenuIdx !== 0) {
      scenicOrderList.splice(index, 1);
      this.setData({ scenicOrderList });
    } else {
      this.setData({
        [`scenicOrderList[${index}].status`]: statusEmuns[type]
      });
    }
  },

  updateHotelOrderList(e) {
    const statusEmuns = {
      cancel: 102,
      pay: 201,
      refund: 202,
      confirm: 401
    };
    const { type, index } = e.detail;
    const { menuList, hotelOrderList } = this.data;
    const { curSubMenuIdx } = menuList[1];
    if (type === "delete" || curSubMenuIdx !== 0) {
      hotelOrderList.splice(index, 1);
      this.setData({ hotelOrderList });
    } else {
      this.setData({
        [`hotelOrderList[${index}].status`]: statusEmuns[type]
      });
    }
  },

  updateMealTicketOrderList(e) {
    const statusEmuns = {
      cancel: 102,
      pay: 201,
      refund: 202,
      confirm: 401
    };
    const { type, index } = e.detail;
    const { menuList, mealTicketOrderList } = this.data;
    const { curSubMenuIdx } = menuList[4];
    if (type === "delete" || curSubMenuIdx !== 0) {
      mealTicketOrderList.splice(index, 1);
      this.setData({ mealTicketOrderList });
    } else {
      this.setData({
        [`mealTicketOrderList[${index}].status`]: statusEmuns[type]
      });
    }
  },

  updateSetMealOrderList(e) {
    const statusEmuns = {
      cancel: 102,
      pay: 201,
      refund: 202,
      confirm: 401
    };
    const { type, index } = e.detail;
    const { menuList, setMealOrderList } = this.data;
    const { curSubMenuIdx } = menuList[4];
    if (type === "delete" || curSubMenuIdx !== 0) {
      setMealOrderList.splice(index, 1);
      this.setData({ setMealOrderList });
    } else {
      this.setData({
        [`setMealOrderList[${index}].status`]: statusEmuns[type]
      });
    }
  },

  updateGoodsOrderList(e) {
    const statusEmuns = {
      cancel: 102,
      pay: 201,
      refund: 202,
      confirm: 401
    };
    const { type, index } = e.detail;
    const { menuList, goodsOrderList } = this.data;
    const { curSubMenuIdx } = menuList[4];
    if (type === "delete" || curSubMenuIdx !== 0) {
      goodsOrderList.splice(index, 1);
      this.setData({ goodsOrderList });
    } else {
      this.setData({
        [`goodsOrderList[${index}].status`]: statusEmuns[type]
      });
    }
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
