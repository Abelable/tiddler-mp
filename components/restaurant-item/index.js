Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: {
      type: Object,
      observer({ facilityList = [] }) {
        this.setData({ facilityList: facilityList.slice(0, 2) });
      }
    },
    showTag: Boolean
  },

  data: {
    visible: false,
    facilityList: []
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
      const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
