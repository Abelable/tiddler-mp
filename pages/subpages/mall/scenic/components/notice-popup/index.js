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

  methods: {
    // todo 
    contact() {
      console.log("contact");
    },

    confirm() {
      if (this.properties.onlyCheck) {
        this.hide();
      } else {
        store.setScenicPreOrderInfo(this.properties.info);
        wx.navigateTo({
          url: "/pages/subpages/mall/scenic/subpages/order-check/index",
        });
      }
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
