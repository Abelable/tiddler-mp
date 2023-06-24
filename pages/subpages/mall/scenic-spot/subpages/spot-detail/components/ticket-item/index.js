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
      const { id } = this.properties.ticket;
      const url = `/pages/subpages/mall/scenic-spot/subpages/order-check/index?id=${id}`;
      wx.navigateTo({ url });
    },
  },
});
