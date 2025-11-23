import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../config";
import ShopService from "./utils/shopService";

const shopService = new ShopService();

const orderToolList = [
  { icon: "confirm", name: "待确认" },
  { icon: "luggage", name: "待出行" },
  { icon: "evaluate", name: "已评价" },
  { icon: "after_sale", name: "售后" }
];
const toolList = [
  { icon: "scenic", name: "景点管理", route: "scenic/list" },
  { icon: "ticket", name: "门票管理", route: "ticket/list" },
  { icon: "manager", name: "人员管理", route: "manager/list" },
  { icon: "shop", name: "店铺管理", route: "info" },
  { icon: "bond", name: "店铺保证金", route: "deposit" }
];

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"]
  },

  lifetimes: {
    attached() {
      this.init();
    }
  },

  pageLifetimes: {
    show() {
      if (this.inited) {
        this.initOverviewData();
      }
    }
  },

  data: {
    shopId: 0,
    shopIncomeOverview: null,
    shopOrderTotal: null,
    orderToolList,
    toolList
  },

  methods: {
    init() {
      const { scenicShopId, scenicShopManagerList } = store.userInfo;
      this.setData({
        shopId: scenicShopId || scenicShopManagerList[0].shopId
      });
      this.inited = true;
      this.initOverviewData();
    },

    initOverviewData() {
      this.setShopIncomeOverview();
      this.setShopOrderTotal();
    },

    async setShopIncomeOverview() {
      const shopIncomeOverview = await shopService.getShopIncomeOverview(
        this.data.shopId
      );
      this.setData({ shopIncomeOverview });
    },

    async setShopOrderTotal() {
      const shopOrderTotal = await shopService.getScenicShopOrderTotal(
        this.data.shopId
      );
      this.setData({ shopOrderTotal });
    },

    withdraw() {
      const url = `/pages/subpages/mine/merchant/subpages/income-detail/index?merchantType=1`;
      wx.navigateTo({ url });
    },

    checkOrders(e) {
      const { status } = e.currentTarget.dataset;
      const { shopId } = this.data;
      if (status === 4) {
        // todo 售后
      } else {
        wx.navigateTo({
          url: `/pages/subpages/mine/merchant/subpages/scenic-order/index?shopId=${shopId}&status=${
            status || 0
          }`
        });
      }
    },

    checkTool(e) {
      const { route } = e.currentTarget.dataset;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/scenic/shop/${route}&shop_id=${this.data.shopId}`;
      wx.navigateTo({ url });
    }
  }
});
