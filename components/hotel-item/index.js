Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    item: Object,
  },

  data: {
    visible: false,
  },

  methods: {
    onCoverLoaded() {
      this.setData({ visible: true });
    },

    checkDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },
  },
});
