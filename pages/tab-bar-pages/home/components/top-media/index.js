Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    mediaList: Array
  },

  data: {
    curMediaIdx: 0,
    autoplay: true
  },

  pageLifetimes: {
    show() {
      this.setData({ autoplay: true });
    },
    hide() {
      this.setData({ autoplay: false });
    }
  },

  methods: {
    swiperChange(e) {
      const curMediaIdx = e.detail.current;
      this.setData({ curMediaIdx });
    },

    selectTopMedia(e) {
      const curMediaIdx = e.currentTarget.dataset.index;
      this.setData({ curMediaIdx });
    },

    navToNoteDetail(e) {
      const { id, type } = e.currentTarget.dataset;

      let url;
      switch (type) {
        case 1:
          url = `/pages/subpages/home/media/live/live-play/index?id=${id}&mediaScene=1&authorId=0`;
          break;
        case 2:
          url = `/pages/subpages/home/media/video/index?id=${id}&mediaScene=1&authorId=0`;
          break;
        case 3:
          url = `/pages/subpages/home/media/note/index?id=${id}`;
          break;
      }

      wx.navigateTo({ url });
    }
  }
});
