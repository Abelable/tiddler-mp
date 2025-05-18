import { WEBVIEW_BASE_URL } from "../../../../config";
import { store } from "../../../../store/index";
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    titleMenu: [],
    curTitleIdx: 0
  },

  onLoad() {
    this.setTitleMenu();
  },

  setTitleMenu() {
    const { merchantType, userInfo } = store;
    const {
      scenicProviderId,
      hotelProviderId,
      cateringProviderId,
      merchantId
    } = userInfo;

    const titleMenu = [];
    if (scenicProviderId) {
      titleMenu.push({ name: "景区管理", type: "scenic", value: 1 });
    }
    if (hotelProviderId) {
      titleMenu.push({ name: "酒店管理", type: "hotel", value: 2 });
    }
    if (cateringProviderId) {
      titleMenu.push({ name: "餐饮管理", type: "catering", value: 3 });
    }
    if (merchantId) {
      titleMenu.push({ name: "电商管理", type: "goods", value: 4 });
    }

    const curTitleIdx = titleMenu.findIndex(
      item => item.value === merchantType
    );

    this.setData({ titleMenu, curTitleIdx });
  },

  selectTitle(e) {
    const curTitleIdx = +e.detail.value;
    this.setData({ curTitleIdx });
  },

  withdraw() {
    const { titleMenu, curTitleIdx } = this.data;
    const merchantType = titleMenu[curTitleIdx].value;
    switch (merchantType) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
    }
  },

  checkOrders() {
    const { titleMenu, curTitleIdx } = this.data;
    const merchantType = titleMenu[curTitleIdx].value;
    switch (merchantType) {
      case 1:
        wx.navigateTo({
          url: "./subpages/scenic-order/index"
        });
        break;
      case 2:
        wx.navigateTo({
          url: "./subpages/hotel-order/index"
        });
        break;
      case 4:
        break;
    }
  },

  checkMealTicketOrders() {
    wx.navigateTo({
      url: "./subpages/meal-ticket-order/index"
    });
  },

  checkSetMealOrders() {
    wx.navigateTo({
      url: "./subpages/set-meal-order/index"
    });
  },

  checkAfterSale() {
    const { titleMenu, curTitleIdx } = this.data;
    const merchantType = titleMenu[curTitleIdx].value;
    switch (merchantType) {
      case 1:
        break;
      case 2:
        break;
      case 4:
        break;
    }
  },

  checkMealTicketAfterSale() {},

  checkSetMealAfterSale() {},

  manageStaff() {
    const { titleMenu, curTitleIdx } = this.data;
    const merchantType = titleMenu[curTitleIdx].value;
    switch (merchantType) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
    }
  },

  manageBond() {
    const { titleMenu, curTitleIdx } = this.data;
    const merchantType = titleMenu[curTitleIdx].value;
    switch (merchantType) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
    }
  },

  manageScenicTicket() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/scenic/ticket/list`;
    wx.navigateTo({ url });
  },

  manageScenicSpot() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/scenic/spot/list`;
    wx.navigateTo({ url });
  },

  manageHotelRoom() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/hotel/room/list`;
    wx.navigateTo({ url });
  },

  manageHotel() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/hotel/list`;
    wx.navigateTo({ url });
  },

  manageRestaurant() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/catering/restaurant/list`;
    wx.navigateTo({ url });
  },

  manageMealTicket() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/catering/meal_ticket/list`;
    wx.navigateTo({ url });
  },

  manageSetMeal() {
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/catering/set_meal/list`;
    wx.navigateTo({ url });
  },

  onUnload() {
    const { titleMenu, curTitleIdx } = this.data;
    const merchantType = titleMenu[curTitleIdx].value;
    store.setMerchantType(merchantType);
  }
});
