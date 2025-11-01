Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    item: {
      type: Object,
      observer({ imageList = [] }) {
        this.setData({
          imageList: imageList.slice(0, 3)
        })
      }
    },
    showBorder: {
      type: Boolean,
      value: true
    }
  },

  data: {
    imageList: []
  },

  methods: {
    previewImage(e) {
      const { current } = e.currentTarget.dataset;
      const urls = this.properties.item.imageList;
      wx.previewImage({ current, urls });
    },
  },
});
