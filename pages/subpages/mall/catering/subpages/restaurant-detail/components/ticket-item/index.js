import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../../store/index";

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"]
  },

  properties: {
    restaurantId: Number,
    restaurantName: String,
    ticket: {
      type: Object,
      observer({
        price,
        originalPrice,
        useTimeList,
        overlayUsageLimit,
        inapplicableProducts,
        boxAvailable,
        needPreBook
      }) {
        const discount = parseFloat(((price / originalPrice) * 10).toFixed(1));

        const tips = [];
        if (useTimeList.length) {
          tips.push("部分时段可用");
        } else {
          tips.push("营业时间可用");
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
        } else {
          tips.push("免预约");
        }

        this.setData({ discount, tips: tips.slice(0, 3).join("｜") });
      }
    }
  },

  data: {
    discount: 0,
    tips: "",
    commission: 0,
    commissionVisible: false
  },

  lifetimes: {
    attached() {
      this.setCommission();
    }
  },

  methods: {
    setCommission() {
      const {
        price,
        salesCommissionRate,
        promotionCommissionRate,
        promotionCommissionUpperLimit
      } = this.properties.ticket;
      const commission =
        Math.round(
          price * (salesCommissionRate / 100) * promotionCommissionRate
        ) / 100;
      this.setData({
        commission: Math.min(commission, promotionCommissionUpperLimit)
      });
    },

    toggleCommissionVisible() {
      this.setData({
        commissionVisible: !this.data.commissionVisible
      });
    },

    checkDetail() {
      const { ticket, restaurantId, restaurantName } = this.properties;
      const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/subpages/meal-ticket-detail/index?ticketId=${ticket.id}&restaurantId=${restaurantId}&restaurantName=${restaurantName}`;
      wx.navigateTo({ url });
    },

    buy() {
      const { restaurantId, restaurantName, ticket } = this.properties;
      const url = `/pages/subpages/mall/catering/subpages/meal-ticket-order-check/index?ticketId=${ticket.id}&restaurantId=${restaurantId}&restaurantName=${restaurantName}`;
      wx.navigateTo({ url });
    }
  }
});
