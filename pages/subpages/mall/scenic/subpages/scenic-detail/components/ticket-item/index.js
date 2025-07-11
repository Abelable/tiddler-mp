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
    ticket: Object
  },

  data: {
    commission: 0,
    commissionVisible: false
  },

  lifetimes: {
    attached() {
      this.setCommission();
    }
  },

  methods: {
    showNoticePopup() {
      this.triggerEvent("showNoticePopup", this.properties.ticket);
    },

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

    booking() {
      store.setScenicPreOrderInfo(this.properties.ticket);
      wx.navigateTo({
        url: "/pages/subpages/mall/scenic/subpages/order-check/index"
      });
    }
  }
});
