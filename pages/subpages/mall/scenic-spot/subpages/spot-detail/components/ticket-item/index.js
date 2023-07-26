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
      const { id, categoryId } = this.properties.ticket;
      const url = `/pages/subpages/mall/scenic-spot/subpages/order-check/index?ticketId=${id}&categoryId=${categoryId}`;
      wx.navigateTo({ url });
    },
  },
});
