import { store } from "../../../../../../../../store/index";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    ticket: Object,
  },

  methods: {
    showNoticePopup() {
      this.triggerEvent("showNoticePopup", this.properties.ticket);
    },

    booking() {
      store.setScenicPreOrderInfo(this.properties.ticket);
      wx.navigateTo({
        url: "/pages/subpages/mall/scenic-spot/subpages/order-check/index",
      });
    },
  },
});
