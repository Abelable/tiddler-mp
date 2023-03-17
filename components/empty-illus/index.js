Component({
  properties: {
    desc: String,
    registerBtnVisible: Boolean,
    height: {
      type: String,
      value: '800rpx'
    }
  },

  methods: {
    register() {
      wx.navigateTo({
        url: "/pages/subpages/common/register/index",
      });
    },
  },
});
