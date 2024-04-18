Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: {
      type: Object,
      observer({ featureTagList }) {
        this.setData({ featureTagList: featureTagList.slice(0, 2) });
      }
    }
  },

  data: {
    visible: false,
    featureTagList: []
  },

  methods: {
    onCoverLoaded() {
      this.setData({ visible: true });
    },

    checkDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
