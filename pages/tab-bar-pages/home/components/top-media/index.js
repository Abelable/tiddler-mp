const dayjs = require("dayjs");

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    topMediaList: {
      type: Array,
      observer(list) {
        const monthDescList = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC"
        ];
        const mediaList = list.map((item, index) => {
          const time = dayjs().subtract(index, "day");
          const year = time.year();
          const monthIdx = time.month();
          const date = time.date();
          return {
            ...item,
            cover: item.type === 3 ? item.imageList[0] : item.cover,
            year,
            month: monthDescList[monthIdx],
            date
          };
        });

        this.setData({ mediaList });
      }
    }
  },

  data: {
    curMediaIdx: 0,
    mediaList: [],
    autoplay: true
  },

  pageLifetimes: {
    show() {
      this.setData({ autoplay: true })
    },
    hide() {
      this.setData({ autoplay: false })
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
          url = `/pages/subpages/home/media/note/index?id=${id}&mediaScene=1&authorId=0`;
          break;
      }

      wx.navigateTo({ url });
    }
  }
});
