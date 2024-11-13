const dayjs = require("dayjs");

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    topMediaList: {
      type: Array,
      observer(list) {
        const mediaList = list.map((item, index) => {
          let year, monthIdx, date;
          if (index === 0) {
            year = dayjs().year();
            monthIdx = dayjs().month();
            date = dayjs().date();
          } else {
            year = dayjs(item.createdAt).year();
            monthIdx = dayjs(item.createdAt).month();
            date = dayjs(item.createdAt).date();
          }

          const month = [
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
          ][monthIdx];
          return {
            ...item,
            time: {
              year,
              month,
              date
            }
          };
        });
        this.setData({ mediaList });
      }
    }
  },

  data: {
    curTopMediaIdx: 0,
    mediaList: []
  },

  methods: {
    selectTopMedia(e) {
      const curTopMediaIdx = e.currentTarget.dataset.index;
      this.setData({ curTopMediaIdx });
    },

    navToNoteDetail(e) {
      const { id } = e.currentTarget.dataset;
      const url = `/pages/subpages/home/media/note/index?id=${id}&mediaScene=1&authorId=0`;
      wx.navigateTo({ url });
    }
  }
});
