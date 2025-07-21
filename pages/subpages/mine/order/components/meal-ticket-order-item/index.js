import dayjs from "dayjs";
import OrderService from "../../utils/orderService";

const orderService = new OrderService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    index: Number
  },

  data: {
    countdown: 0,
    refundBtnVisible: false
  },

  lifetimes: {
    attached() {
      const { status, createdAt, payTime } = this.properties.item;
      if (status === 101) {
        const countdown = Math.floor(
          (dayjs(createdAt).valueOf() +
            24 * 60 * 60 * 1000 -
            dayjs().valueOf()) /
            1000
        );
        if (countdown > 0) {
          this.setData({ countdown });
          this.setCountdown();
        }
      }

      if (status === 201) {
        if (dayjs().diff(dayjs(payTime), "minute") <= 30) {
          this.setData({ refundBtnVisible: true });
        }
      }
    },

    detached() {
      clearInterval(this.countdownInterval);
    }
  },

  methods: {
    setCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.data.countdown <= 0) {
          clearInterval(this.countdownInterval);
          this.cancelOrder();
          return;
        }
        this.setData({
          countdown: this.data.countdown - 1
        });
      }, 1000);
    },

    async payOrder() {
      const { item, index } = this.properties;
      const params = await orderService.getMealTicketPayParams(item.id);
      wx.requestPayment({
        ...params,
        success: () => {
          this.triggerEvent("update", { type: "pay", index });
        }
      });
    },

    refundOrder() {
      wx.showModal({
        title: "确定申请退款吗？",
        success: result => {
          if (result.confirm) {
            const { item, index } = this.properties;
            orderService.refundMealTicketOrder(item.id, () => {
              this.triggerEvent("update", { type: "refund", index });
            });
          }
        }
      });
    },

    confirmOrderCancel() {
      wx.showModal({
        title: "确定取消该订单吗？",
        success: result => {
          if (result.confirm) {
            this.cancelOrder();
          }
        }
      });
    },

    cancelOrder() {
      const { item, index } = this.properties;
      orderService.cancelMealTicketOrder(item.id, () => {
        this.triggerEvent("update", { type: "cancel", index });
      });
    },

    deleteOrder() {
      wx.showModal({
        title: "确定删除该订单吗？",
        success: result => {
          if (result.confirm) {
            const { item, index } = this.properties;
            orderService.deleteMealTicketOrder([item.id], () => {
              this.triggerEvent("update", { type: "delete", index });
            });
          }
        }
      });
    },

    async checkQRcode() {
      const { id, ticketInfo } = this.properties.item;
      const verifyCode = await orderService.getMealTicketVerifyCode(
        id,
        ticketInfo.restaurantId
      );
      this.triggerEvent("checkQRcode", { verifyCode });
    },

    navToDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mine/order/subpages/meal-ticket-order/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    navToEvaluation() {
      const { id, restaurantId } = this.properties.item;
      const url = `/pages/subpages/mine/order/subpages/meal-ticket-order/evaluation/index?orderId=${id}&restaurantId=${restaurantId}`;
      wx.navigateTo({ url });
    },

    navToRestaurant() {
      const { restaurantId } = this.properties.item;
      const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${restaurantId}`;
      wx.navigateTo({ url });
    }
  }
});
