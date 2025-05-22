Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: {
      type: Object,
      observer({ featureTagList = [] }) {
        this.setData({ featureTagList: featureTagList.slice(0, 2) });
      }
    }
  },

  data: {
    visible: false,
    featureTagList: []
  },

  methods: {
    onCoverLoaded(e) {
      const { width, height } = e.detail;
      const coverHeight = 350 / width * height;
      this.setData({
        [`item.coverHeight`]:
          coverHeight > 480 ? 480 : coverHeight < 260 ? 260 : coverHeight
      });
      this.setData({ visible: true });
    },

    checkDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
