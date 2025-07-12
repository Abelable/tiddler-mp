import { store } from "../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../config";
import ShopService from "./utils/shopService";

const shopService = new ShopService();

const orderToolList = [
  { icon: "confirm", name: "待确认" },
  { icon: "time", name: "待使用" },
  { icon: "evaluate", name: "已评价" },
  { icon: "after_sale", name: "售后" }
];

const toolList = [
  { icon: "ticket", name: "餐券管理", route: "ticket/list" },
  { icon: "food", name: "套餐管理", route: "set_meal/list" },
  { icon: "shop", name: "门店管理", route: "info" },
  { icon: "bond", name: "保证金", route: "deposit" },
  { icon: "manager", name: "人员管理", route: "manager/list" }
];

Component({
  options: {
    addGlobalClass: true
  },

  lifetimes: {
    attached() {
      // this.init();
    }
  },

  pageLifetimes: {
    show() {
      // this.init();
    }
  },

  data: {
    shopIncomeOverview: null,
    shopOrderTotal: null,
    orderToolList,
    toolList
  },

  methods: {
    init() {
      this.setShopIncomeOverview();
      this.setShopOrderTotal();
    },

    async setShopIncomeOverview() {
      const { shopId } = store.userInfo;
      const shopIncomeOverview = await shopService.getShopIncomeOverview(
        shopId
      );
      this.setData({ shopIncomeOverview });
    },

    async setShopOrderTotal() {
      const { shopId } = store.userInfo;
      const shopOrderTotal = await shopService.getShopOrderTotal(shopId);
      this.setData({ shopOrderTotal });
    },

    withdraw() {
      const url = `/pages/subpages/mine/merchant/subpages/income-detail/index?merchantType=3`;
      wx.navigateTo({ url });
    },

    checkTicketOrders(e) {
      const { status } = e.currentTarget.dataset;
      if (status === 4) {
        // todo 售后
      } else {
        wx.navigateTo({
          url: `/pages/subpages/mine/merchant/subpages/meal-ticket-order/index?status=${
            status || 0
          }`
        });
      }
    },

    checkSetMealOrders(e) {
      const { status } = e.currentTarget.dataset;
      if (status === 4) {
        // todo 售后
      } else {
        wx.navigateTo({
          url: `/pages/subpages/mine/merchant/subpages/set-meal-order/index?status=${
            status || 0
          }`
        });
      }
    },

    checkTool(e) {
      const { route } = e.currentTarget.dataset;
      const { hotelShopId } = store.userInfo;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/hotel_shop/${route}&shop_id=${hotelShopId}`;
      wx.navigateTo({ url });
    }
  }
});
