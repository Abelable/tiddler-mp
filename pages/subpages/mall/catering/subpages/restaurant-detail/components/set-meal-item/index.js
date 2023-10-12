Component({
  options: {
    addGlobalClass: true,
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
        perTabelUsageLimit,
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
        if (perTabelUsageLimit) {
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
  },

  methods: {
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
