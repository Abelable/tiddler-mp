Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: {
      type: Object,
      observer({ facilityList }) {
        this.setData({ facilityList: facilityList.slice(0, 2) });
      }
    }
  },

  data: {
    visible: false,
    facilityList: []
  },

  methods: {
    onCoverLoaded() {
      this.setData({ visible: true });
    },

    checkDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
