Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    imageList: {
      type: Array,
      observer(list) {
        if (list.length > 9) {
          this.setData({
            list: list.slice(0, 6),
            moreCount: list.length - 6,
          });
        } else {
          this.setData({ list });
        }
      },
    },
    title: String,
  },

  data: {
    list: [],
    moreCount: 0,
  },

  methods: {
    previewImage(e) {
      const { current } = e.currentTarget.dataset;
      const urls = this.properties.imageList;
      wx.previewImage({ current, urls });
    },

    previewMore() {
      const urls = this.properties.imageList;
      wx.previewImage({ current: urls[5], urls });
    }
  },
});
