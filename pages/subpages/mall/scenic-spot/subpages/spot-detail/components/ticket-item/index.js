Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    ticket: Object,
  },

  lifetimes: {
    attached() {
      const { bookingTime } = this.properties.ticket;

      const curDate = new Date();
      const curHour = `${curDate.getHours()}`.padStart(2, "0");
      const curMinute = `${curDate.getMinutes()}`.padStart(2, "0");
      const curTime = +`${curHour}${curMinute}`;

      const bookingTips =
        curTime <= +bookingTime.replace(":", "") ? "可定今日" : "可定明日";
      this.setData({ bookingTips });
    },
  },

  data: {
    bookingTips: "",
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
