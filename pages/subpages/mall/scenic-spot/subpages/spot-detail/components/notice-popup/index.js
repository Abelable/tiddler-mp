Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: Boolean,
    info: Object,
  },

  methods: {
    contact() {
      console.log("contact");
    },

    confirm() {
      const { id } = this.properties.info
      const url = `/pages/subpages/mall/scenic-spot/subpages/order-check/index?id=${id}`;
      wx.navigateTo({ url });
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
