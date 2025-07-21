import { store } from "../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../config";
import ShopService from "./utils/shopService";

const shopService = new ShopService();

const orderToolList = [
  { icon: "confirm", name: "待确认" },
  { icon: "luggage", name: "待入住" },
  { icon: "evaluate", name: "已评价" },
  { icon: "after_sale", name: "售后" }
];

const toolList = [
  { icon: "hotel", name: "酒店管理", route: "hotel/list" },
  { icon: "room", name: "房间管理", route: "room/list" },
  { icon: "manager", name: "人员管理", route: "manager/list" },
  { icon: "shop", name: "店铺管理", route: "info" },
  { icon: "bond", name: "店铺保证金", route: "deposit" },
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
      const { hotelShopId } = store.userInfo;
      const shopIncomeOverview = await shopService.getShopIncomeOverview(
        hotelShopId
      );
      this.setData({ shopIncomeOverview });
    },

    async setShopOrderTotal() {
      const { hotelShopId } = store.userInfo;
      const shopOrderTotal = await shopService.getShopOrderTotal(hotelShopId);
      this.setData({ shopOrderTotal });
    },

    withdraw() {
      const url = `/pages/subpages/mine/merchant/subpages/income-detail/index?merchantType=2`;
      wx.navigateTo({ url });
    },

    checkOrders(e) {
      const { status } = e.currentTarget.dataset;
      if (status === 4) {
        // todo 售后
      } else {
        wx.navigateTo({
          url: `/pages/subpages/mine/merchant/subpages/hotel-order/index?status=${
            status || 0
          }`
        });
      }
    },

    checkTool(e) {
      const { route } = e.currentTarget.dataset;
      const { hotelShopId } = store.userInfo;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/hotel/shop/${route}&shop_id=${hotelShopId}`;
      wx.navigateTo({ url });
    }
  }
});
