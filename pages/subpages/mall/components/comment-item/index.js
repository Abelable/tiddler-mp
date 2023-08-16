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
    }
  },

  data: {
    imageList: []
  },

  methods: {
  },
});
