import { store } from "../../../../../../../../store/index";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    ticket: {
      type: Object,
      observer({ price, originalPrice, includingDrink, boxAvailable }) {
        const discount = parseFloat(((price / originalPrice) * 10).toFixed(1));

        // let useRangeDesc = ''
        // if (!includingDrink) {
        //   useRangeDesc = '部分商品可用'
        // } else {

        // }
        // if (includingDrink && boxAvailable) {
        //   useRangeDesc = '全场通用'
        // } else if (includingDrink && !boxAvailable) {
        //   useRangeDesc = ''
        // } else if (!includingDrink && boxAvailable) {
        //   useRangeDesc = '部分商品可用'
        // }
        
        this.setData({ discount });
      },
    },
  },

  data: {
    discount: 0,
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
