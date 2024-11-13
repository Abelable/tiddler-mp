const dayjs = require("dayjs");

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    topMediaList: {
      type: Array,
      observer(list) {
        const mediaList = list.map(item => {
          const { year, month: monthIdx, date} = dayjs(item.createdAt);
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
              year, month, date
            }
          }
        });
        this.setData({ mediaList })
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
    }
  }
});
