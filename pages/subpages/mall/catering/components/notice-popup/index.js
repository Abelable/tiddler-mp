import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ["checkInDate"],
  },

  options: {
    addGlobalClass: true,
  },

  properties: {
    show: Boolean,
    info: Object,
    onlyCheck: Boolean,
  },

  data: {
    curDot: 1,
  },

  methods: {
    previewImage(e) {
      const { current, urls } = e.currentTarget.dataset;
      wx.previewImage({ current, urls });
    },

    bannerChange(e) {
      this.setData({
        curDot: e.detail.current + 1,
      });
    },

    contact() {
      console.log("contact");
    },

    confirm() {
      if (this.properties.onlyCheck) {
        this.hide();
      } else {
        store.setHotelPreOrderInfo(this.properties.info);
        wx.navigateTo({
          url: "/pages/subpages/mall/hotel/subpages/order-check/index",
        });
      }
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
