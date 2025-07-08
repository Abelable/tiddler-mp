import { store } from "../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../config";
import ShopService from "./utils/shopService";

const shopService = new ShopService();

const orderToolList = [
  { icon: "time", name: "待确认" },
  { icon: "luggage", name: "待出行" },
  { icon: "evaluate", name: "已评价" },
  { icon: "after_sale", name: "售后" }
];
const toolList = [
  { icon: "ticket", name: "门票管理", route: "goods/list" },
  { icon: "scenic", name: "景点管理", route: "freight_template/list" },
  { icon: "shop", name: "店铺管理", route: "info" },
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
      const url = `/pages/subpages/mine/merchant/subpages/income-detail/index?merchantType=1`;
      wx.navigateTo({ url });
    },

    checkOrders(e) {
      const { status } = e.currentTarget.dataset;
      if (status === 4) {
        // todo 售后
      } else {
        wx.navigateTo({
          url: `/pages/subpages/mine/merchant/subpages/scenic-order/index?status=${
            status || 0
          }`
        });
      }
    },

    checkTool(e) {
      const { route } = e.currentTarget.dataset;
      const { scenicShopId } = store.userInfo;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/scenic_shop/${route}&shop_id=${scenicShopId}`;
      wx.navigateTo({ url });
    }
  }
});
