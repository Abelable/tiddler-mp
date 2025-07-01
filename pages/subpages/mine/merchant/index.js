import { store } from "../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../config";
import MerchantService from "./utils/merchantService";

const merchantService = new MerchantService();

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    titleMenu: [],
    curTitleIdx: 0,
    shopIncomeOverview: null,
    shopOrderTotal: null
  },

  onLoad() {
    this.setTitleMenu();
  },

  async setTitleMenu() {
    const { merchantType, userInfo } = store;
    const {
      scenicProviderId,
      hotelProviderId,
      cateringProviderId,
      merchantInfo
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
    if (merchantInfo.id) {
      titleMenu.push({ name: "电商管理", type: "goods", value: 4 });

      this.setShopIncomeOverview();
      this.setShopOrderTotal();
    }

    const curTitleIdx = merchantType
      ? titleMenu.findIndex(item => item.value === merchantType)
      : 0;

    this.setData({ titleMenu, curTitleIdx });
  },

  async setShopIncomeOverview() {
    const shopId = store.userInfo.merchantInfo.shopIds[0];
    const shopIncomeOverview = await merchantService.getShopIncomeOverview(
      shopId
    );
    this.setData({ shopIncomeOverview });
  },

  async setShopOrderTotal() {
    const shopId = store.userInfo.merchantInfo.shopIds[0];
    const shopOrderTotal = await merchantService.getShopOrderTotal(shopId);
    this.setData({ shopOrderTotal });
  },

  selectTitle(e) {
    const curTitleIdx = +e.detail.value;
    this.setData({ curTitleIdx });
  },

  withdraw() {
    const { titleMenu, curTitleIdx } = this.data;
    const merchantType = titleMenu[curTitleIdx].value;
    const url = `./subpages/income-detail/index?merchantType=${merchantType}`;
    wx.navigateTo({ url });
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
        wx.navigateTo({
          url: "./subpages/goods-order/index"
        });
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

  manageShopInfo() {
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
        const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/shop_info`;
        wx.navigateTo({ url });
        break;
    }
  },

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
        const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/manager/list`;
        wx.navigateTo({ url });
        break;
    }
  },

  manageDeposit() {
    const shopId = store.userInfo.merchantInfo.shopIds[0];
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
        const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/deposit&shop_id=${shopId}`;
        wx.navigateTo({ url });
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

  manageGoods() {
    const shopId = store.userInfo.merchantInfo.shopIds[0];
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/goods/list&shop_id=${shopId}`;
    wx.navigateTo({ url });
  },

  manageRefundAddress() {
    const shopId = store.userInfo.merchantInfo.shopIds[0];
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/refund_address/list&shop_id=${shopId}`;
    wx.navigateTo({ url });
  },

  managePickupAddress() {
    const shopId = store.userInfo.merchantInfo.shopIds[0];
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/pickup_address/list&shop_id=${shopId}`;
    wx.navigateTo({ url });
  },

  manageFreightTemplate() {
    const shopId = store.userInfo.merchantInfo.shopIds[0];
    const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/freight_template/list&shop_id=${shopId}`;
    wx.navigateTo({ url });
  },

  onUnload() {
    const { titleMenu, curTitleIdx } = this.data;
    const merchantType = titleMenu[curTitleIdx].value;
    store.setMerchantType(merchantType);
  }
});
