import { store } from "../../../../../../../../store/index";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    ticket: {
      type: Object,
      observer({
        price,
        originalPrice,
        useTimeList,
        overlayUsageLimit,
        inapplicableProducts,
        boxAvailable,
        needPreBook,
      }) {
        const discount = parseFloat(((price / originalPrice) * 10).toFixed(1));

        const tips = [];
        if (useTimeList.length) {
          tips.push("部分时段可用");
        }
        if (overlayUsageLimit) {
          tips.push(`单次可用${overlayUsageLimit}张`);
        } else {
          tips.push("不限张数");
        }
        if (inapplicableProducts.length) {
          tips.push("部分商品可用");
        } else {
          tips.push("全场通用");
        }
        if (boxAvailable) {
          tips.push("可用于包间消费");
        }
        if (needPreBook) {
          tips.push("需预约");
        }

        this.setData({ discount, tips: tips.slice(0, 3) });
      },
    },
  },

  data: {
    discount: 0,
    tips: [],
  },

  methods: {
    checkDetail() {
      const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/subpages/meal-ticket-detail/index?id=${this.properties.ticket.id}`;
      wx.navigateTo({ url });
    },

    buy() {
      store.setMealTicketPreOrderInfo(this.properties.ticket);
      wx.navigateTo({
        url: "/pages/subpages/mall/catering/subpages/order-check/index",
      });
    },
  },
});
