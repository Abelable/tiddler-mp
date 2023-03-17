Component({
  properties: {
    desc: String,
    registerBtnVisible: Boolean,
  },

  methods: {
    register() {
      wx.navigateTo({
        url: "/pages/subpages/common/register/index",
      });
    },
  },
});
