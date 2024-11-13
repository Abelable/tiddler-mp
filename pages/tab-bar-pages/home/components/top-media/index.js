const dayjs = require("dayjs");

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    topMediaList: Array
  },

  lifetimes: {
    attached() {
      this.setTimeList()
    }
  },

  data: {
    curTopMediaIdx: 0,
    timeList: []
  },

  methods: {
    setTimeList() {
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
      const timeList = new Array(5).fill("").map((item, index) => {
        const time = dayjs().subtract(index, "day");
        const year = time.year();
        const monthIdx = time.month();
        const date = time.date();
        return {
          year,
          month: monthDescList[monthIdx],
          date
        };
      });
      this.setData({ timeList });
    },

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
