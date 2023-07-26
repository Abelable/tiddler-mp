Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: Boolean,
    info: Object,
    onlyCheck: Boolean
  },

  methods: {
    contact() {
      console.log("contact");
    },

    confirm() {
      if (this.properties.onlyCheck) {
        this.hide()
      } else {
        const { id, categoryId } = this.properties.info;
        const url = `/pages/subpages/mall/scenic-spot/subpages/order-check/index?ticketId=${id}&categoryId=${categoryId}`;
        wx.navigateTo({ url });
      }
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
