import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../../store/index";

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo", "checkInDate"]
  },

  properties: {
    roomInfo: Object,
    typeIndex: Number,
    roomIndex: Number
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
    setCommission() {
      const {
        price,
        salesCommissionRate,
        promotionCommissionRate,
        promotionCommissionUpperLimit
      } = this.properties.roomInfo;
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

    preorder() {
      const { typeIndex, roomIndex } = this.properties;
      this.triggerEvent("preorder", { typeIndex, roomIndex });
    },

    showNoticePopup() {
      const { typeIndex, roomIndex } = this.properties;
      this.triggerEvent("showNoticePopup", { typeIndex, roomIndex });
    },
  }
});
