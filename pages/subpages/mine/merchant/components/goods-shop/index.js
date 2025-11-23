import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../config";
import ShopService from "./utils/shopService";

const shopService = new ShopService();

const orderToolList = [
  { icon: "package", name: "待发货" },
  { icon: "delivery", name: "待收货" },
  { icon: "time", name: "待使用" },
  { icon: "evaluate", name: "已评价" },
  { icon: "after_sale", name: "售后" }
];
const toolList = [
  { icon: "goods", name: "商品管理", route: "goods/list" },
  { icon: "text", name: "运费模板", route: "freight_template/list" },
  { icon: "address", name: "退货地址", route: "refund_address/list" },
  { icon: "address", name: "提货地点", route: "pickup_address/list" },
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
      const { shopId, shopManagerList } = store.userInfo;
      this.setData({
        shopId: shopId || shopManagerList[0].shopId
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
      const shopOrderTotal = await shopService.getShopOrderTotal(
        this.data.shopId
      );
      this.setData({ shopOrderTotal });
    },

    withdraw() {
      const url = `/pages/subpages/mine/merchant/subpages/income-detail/index?merchantType=4`;
      wx.navigateTo({ url });
    },

    checkOrders(e) {
      const { status } = e.currentTarget.dataset;
      if (status === 5) {
        // todo 售后
      } else {
        wx.navigateTo({
          url: `/pages/subpages/mine/merchant/subpages/goods-order/index?status=${
            status || 0
          }`
        });
      }
    },

    checkTool(e) {
      const { route } = e.currentTarget.dataset;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/goods/shop/${route}&shop_id=${this.data.shopId}`;
      wx.navigateTo({ url });
    }
  }
});
