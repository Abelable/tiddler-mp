Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  methods: {
    navToVideoDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/home/media/video/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
