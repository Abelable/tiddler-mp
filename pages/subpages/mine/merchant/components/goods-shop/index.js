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

  properties: {
    shopId: Number,
    roleId: Number
  },

  data: {
    shopIncomeOverview: null,
    shopOrderTotal: null,
    orderToolList,
    toolList
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

  methods: {
    init() {
      this.inited = true;
      this.initOverviewData();
    },

    initOverviewData() {
      this.setShopIncomeOverview();
      this.setShopOrderTotal();
    },

    async setShopIncomeOverview() {
      const { shopId } = this.properties;
      const shopIncomeOverview = await shopService.getShopIncomeOverview(
        shopId
      );
      this.setData({ shopIncomeOverview });
    },

    async setShopOrderTotal() {
      const { shopId } = this.properties;
      const shopOrderTotal = await shopService.getShopOrderTotal(shopId);
      this.setData({ shopOrderTotal });
    },

    withdraw() {
      const { shopId } = this.properties;
      const url = `/pages/subpages/mine/merchant/subpages/income-detail/index?merchantType=4&shopId=${shopId}`;
      wx.navigateTo({ url });
    },

    checkOrders(e) {
      const { status } = e.currentTarget.dataset;
      const { shopId } = this.properties;
      if (status === 5) {
        wx.navigateTo({
          url: `/pages/subpages/mine/merchant/subpages/goods-refund/index?shopId=${shopId}`
        });
      } else {
        wx.navigateTo({
          url: `/pages/subpages/mine/merchant/subpages/goods-order/index?shopId=${shopId}&status=${
            status || 0
          }`
        });
      }
    },

    checkTool(e) {
      const { route } = e.currentTarget.dataset;
      const { shopId } = this.properties;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/goods/shop/${route}&shop_id=${shopId}`;
      wx.navigateTo({ url });
    }
  }
});
