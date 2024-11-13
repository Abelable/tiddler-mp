Component({
  properties: {
    topMediaList: Array
  },

  data: {
    curTopMediaIdx: 0,
  },

  methods: {
    selectTopMedia(e) {
      const curTopMediaIdx = e.currentTarget.dataset.index;
      this.setData({ curTopMediaIdx });
    },
  }
})
