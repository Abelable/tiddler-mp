import OrderService from "../../utils/orderService";

const orderService = new OrderService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    list: Array,
  },

  methods: {
    async payOrder(e) {
      const { id, index } = e.currentTarget.dataset;
      const params = await orderService.getSetMealOrderPayParams(id);
      wx.requestPayment({
        ...params,
        success: () => {
          this.triggerEvent("update", { type: "pay", index });
        },
      });
    },

    refundOrder(e) {
      const { id, index } = e.currentTarget.dataset;
      orderService.refundSetMealOrder(id, () => {
        this.triggerEvent("update", { type: "refund", index });
      });
    },

    confirmOrder(e) {
      const { id, index } = e.currentTarget.dataset;
      orderService.confirmSetMealOrder(id, () => {
        this.triggerEvent("update", { type: "confirm", index });
      });
    },

    deleteOrder(e) {
      const { id, index } = e.currentTarget.dataset;
      orderService.deleteSetMealOrder(id, () => {
        this.triggerEvent("update", { type: "delete", index });
      });
    },

    cancelOrder(e) {
      const { id, index } = e.currentTarget.dataset;
      orderService.cancelSetMealOrder(id, () => {
        this.triggerEvent("update", { type: "cancel", index });
      });
    },

    navToDetail(e) {
      const id = e.currentTarget.dataset.id;
      const url = `/pages/subpages/mine/order-center/subpages/set-meal-order-list/subpages/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    navToEvaluation(e) {
      const { orderId, restaurantId } = e.currentTarget.dataset;
      const url = `/pages/subpages/mine/order-center/subpages/set-meal-order-list/subpages/evaluation/index?orderId=${orderId}&restaurantId=${restaurantId}`;
      wx.navigateTo({ url });
    },

    navToRestaurant(e) {
      const { id } = e.currentTarget.dataset;
      const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },
  },
});
