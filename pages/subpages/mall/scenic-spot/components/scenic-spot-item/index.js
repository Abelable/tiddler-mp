Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    item: Object,
  },

  data: {},

  methods: {
    navToDetail() {
      wx.navigateTo({
        url: '/pages/subpages/mall/scenic-spot/subpages/spot-detail/index'
      });
    },
  },
});
