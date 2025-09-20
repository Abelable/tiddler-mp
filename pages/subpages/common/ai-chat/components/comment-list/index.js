Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    userInfo: Object,
    msgList: {
      type: Array,
      observer(val) {
        if (val.length && !this.data.stopScroll) this.scrollToBottom();
      }
    }
  },

  data: {
    tipList: [
      "千岛湖景点乐园推荐",
      "千岛湖酒店民宿推荐",
      "千岛湖餐饮美食推荐",
      "千岛湖特色商品推荐"
    ],
    scrollTop: 0,
    stopScroll: false
  },

  methods: {
    sendTip(e) {
      const { tip } = e.currentTarget.dataset;
      this.triggerEvent("sendTip", { tip });
      this.scrollToBottom();
    },

    scrollToBottom() {
      const query = wx.createSelectorQuery().in(this);
      const promise_wrap = new Promise(resolve => {
        query.select(".comment").boundingClientRect(res => {
          res && resolve(res.height);
        });
      });
      const promise_content = new Promise(resolve => {
        query.select(".msg-list").boundingClientRect(res => {
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

    checkMore(e) {
      const { type } = e.currentTarget.dataset;
      const page = ["scenic", "hotel", "catering", "goods"][type - 1];
      const url = `/pages/subpages/mall/${page}/index`;
      wx.navigateTo({ url });
    }
  }
});
