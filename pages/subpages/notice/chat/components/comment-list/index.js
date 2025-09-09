Component({
  properties: {
    userInfo: Object,
    friendAvatarUrl: String,
    msgList: {
      type: Array,
      observer(val) {
        if (val.length && !this.data.stopScroll) this.scrollToBottom();
      }
    }
  },

  data: {
    scrollTop: 0,
    stopScroll: false
  },

  methods: {
    scrollToBottom() {
      const query = wx.createSelectorQuery().in(this);
      const promise_wrap = new Promise(resolve => {
        query.select(".comment").boundingClientRect(res => {
          res && resolve(res.height);
        });
      });
      const promise_content = new Promise(resolve => {
        query.select(".msg-lists").boundingClientRect(res => {
          res && resolve(res.height);
        });
      });
      Promise.all([promise_wrap, promise_content]).then(res => {
        this.setData({
          scrollTop: res[1] - res[0]
        });
      });
      query.exec();
    },

    onTouchStart() {
      clearTimeout(this.stopScrollTimeout);
      !this.data.stopScroll && this.setData({ stopScroll: true });
    },

    onTouchEnd() {
      this.stopScrollTimeout = setTimeout(() => {
        this.setData({ stopScroll: false });
      }, 2000);
    },

    checkProduct(e) {
      const { type, id } = e.currentTarget.dataset;
      const url = `/pages/subpages/mall/${
        ["scenic", "hotel", "catering", "goods"][type - 1]
      }/subpages/${
        ["scenic", "hotel", "restaurant", "goods"][type - 1]
      }-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    checkOrder(e) {
      const { type, id } = e.currentTarget.dataset;
      const url = `/pages/subpages/mine/order/subpages/${
        ["scenic", "hotel", "", "goods", "meal-ticket", "set-meal"][type - 1]
      }-order/order-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
