import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../../store/index";

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"]
  },

  properties: {
    restaurantId: Number,
    restaurantName: String,
    info: {
      type: Object,
      observer({
        price,
        originalPrice,
        useTimeList,
        buyLimit,
        perTableUsageLimit,
        needPreBook,
      }) {
        const discount = parseFloat(((price / originalPrice) * 10).toFixed(1));

        const tips = [];
        if (useTimeList.length) {
          tips.push("部分时段可用");
        } else {
          tips.push("营业时间可用");
        }
        if (buyLimit) {
          tips.push(`限购${buyLimit}张`);
        }
        if (perTableUsageLimit) {
          tips.push(`每桌限用${buyLimit}张`);
        }
        if (needPreBook) {
          tips.push("需预约");
        } else {
          tips.push("免预约");
        }

        this.setData({ discount, tips: tips.slice(0, 3).join("｜") });
      },
    },
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
      } = this.properties.info;
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
      const { info, restaurantId, restaurantName } = this.properties;
      const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/subpages/set-meal-detail/index?setMealId=${info.id}&restaurantId=${restaurantId}&restaurantName=${restaurantName}`;
      wx.navigateTo({ url });
    },

    buy() {
      const { restaurantId, restaurantName, info } = this.properties;
      const url = `/pages/subpages/mall/catering/subpages/set-meal-order-check/index?setMealId=${info.id}&restaurantId=${restaurantId}&restaurantName=${restaurantName}`;
      wx.navigateTo({ url });
    },
  },
});
