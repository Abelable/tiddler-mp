import { store } from "../../../../../../store/index";

Component({
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

    contact() {
      console.log("contact");
    },

    confirm() {
      if (this.properties.onlyCheck) {
        this.hide();
      } else {
        store.setScenicPreOrderInfo(this.properties.info);
        wx.navigateTo({
          url: "/pages/subpages/mall/scenic-spot/subpages/order-check/index",
        });
      }
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
