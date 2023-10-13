Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: Boolean,
    info: {
      type: Object,
      observer({ useTimeList }) {
        this.setUseTimeDescList(useTimeList);
      },
    },
  },

  data: {
    useTimeDescList: [],
  },

  methods: {
    setUseTimeDescList(useTimeList) {
      const useTimeDescList = useTimeList.map((time) => {
        const startWeekDay = weekDayList.find(
          (week) => week.value == time.startWeekDay
        ).text;
        const endWeekDay = weekDayList.find(
          (week) => week.value == time.endWeekDay
        ).text;
        const timeFrameDesc = time.timeFrameList
          .map((timeFrame) => `${timeFrame.openTime}-${timeFrame.closeTime}`)
          .join();
        return `${startWeekDay}至${endWeekDay}: ${timeFrameDesc}`;
      });

      this.setData({ useTimeDescList });
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
