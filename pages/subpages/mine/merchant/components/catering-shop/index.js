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
  { icon: "restaurant", name: "餐厅管理", route: "restaurant/list" },
  { icon: "ticket", name: "餐券管理", route: "ticket/list" },
  { icon: "food", name: "套餐管理", route: "set_meal/list" },
  { icon: "manager", name: "人员管理", route: "manager/list" },
  { icon: "shop", name: "店铺管理", route: "info" },
  { icon: "bond", name: "店铺保证金", route: "deposit" }
];

Component({
  options: {
    addGlobalClass: true
  },

  lifetimes: {
    attached() {
      this.init();
    }
  },

  pageLifetimes: {
    show() {
      this.init();
    }
  },

  data: {
    shopIncomeOverview: null,
    shopMealTicketOrderTotal: null,
    shopSetMealOrderTotal: null,
    orderToolList,
    toolList
  },

  methods: {
    init() {
      this.setShopIncomeOverview();
      this.setShopMealTicketOrderTotal();
      this.setShopSetMealOrderTotal();
    },

    async setShopIncomeOverview() {
      const { cateringShopId } = store.userInfo;
      const shopIncomeOverview = await shopService.getShopIncomeOverview(
        cateringShopId
      );
      this.setData({ shopIncomeOverview });
    },

    async setShopMealTicketOrderTotal() {
      const { cateringShopId } = store.userInfo;
      const shopMealTicketOrderTotal =
        await shopService.getShopMealTicketOrderTotal(cateringShopId);
      this.setData({ shopMealTicketOrderTotal });
    },

    async setShopSetMealOrderTotal() {
      const { cateringShopId } = store.userInfo;
      const shopSetMealOrderTotal = await shopService.getShopSetMealOrderTotal(
        cateringShopId
      );
      this.setData({ shopSetMealOrderTotal });
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
