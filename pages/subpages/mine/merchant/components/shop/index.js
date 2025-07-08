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
  { icon: "address", name: "提货地址", route: "pickup_address/list" },
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
      this.setShopIncomeOverview();
      this.setShopOrderTotal();
    }
  },

  data: {
    shopIncomeOverview: null,
    shopOrderTotal: null,
    orderToolList,
    toolList
  },

  methods: {
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
      const url = `../../subpages/income-detail/index?merchantType=4`;
      wx.navigateTo({ url });
    },

    checkOrders(e) {
      const { status } = e.currentTarget.dataset;
      if (status === 4) {
        // todo 售后
      } else {
        wx.navigateTo({
          url: `../../subpages/goods-order/index?status=${status || 0}`
        });
      }
    },

    checkTool(e) {
      const { route } = e.currentTarget.dataset;
      const { shopId } = store.userInfo;
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/shop/${route}&shop_id=${shopId}`;
      wx.navigateTo({ url });
    }
  }
});
