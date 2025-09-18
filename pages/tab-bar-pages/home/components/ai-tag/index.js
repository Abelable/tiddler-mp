Component({
  properties: {
    scrolling: Boolean
  },

  methods: {
    chat() {
      wx.navigateTo({
        url: "/pages/subpages/common/ai-chat/index"
      });
    }
  }
});
