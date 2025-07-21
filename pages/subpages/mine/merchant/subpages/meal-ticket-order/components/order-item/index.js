import { store } from "../../../../../../../../store/index";
import MealTicketService from "../../utils/mealTicketOrderService";

const mealTicketService = new MealTicketService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    index: Number
  },

  methods: {
    refundOrder() {
      wx.showModal({
        title: "确定取消订单吗？",
        success: result => {
          if (result.confirm) {
            const { item, index } = this.properties;
            const { cateringShopId } = store.userInfo;
            mealTicketService.refundOrder(cateringShopId, item.id, () => {
              this.setData({ refundBtnVisible: false });
              this.triggerEvent("update", { type: "refund", index });
            });
          }
        }
      });
    },

    approveOrder() {
      const { item, index } = this.properties;
      const { cateringShopId } = store.userInfo;
      mealTicketService.approveOrder(cateringShopId, item.id, () => {
        this.triggerEvent("update", { type: "approve", index });
      });
    },

    // todo 联系客户
    contact() {},

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/merchant/subpages/meal-ticket-order/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
