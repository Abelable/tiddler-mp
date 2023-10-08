import dayjs from "dayjs";
import { weekDayList } from "../../../../../../../../utils/index";

Page({
  data: {
    menuList: [
      { name: "营业时间", scene: "openTime" },
      { name: "联系电话", scene: "tel" },
      { name: "设施及服务", scene: "facility" },
    ],
    curMenuIdx: 0,
    openTimeList: [],
    openStatus: false,
    telList: [],
    facilityList: [],
  },

  async onLoad({ info }) {
    const { name, openTimeList, telList, facilityList } = JSON.parse(info);
    wx.setNavigationBarTitle({ title: name });

    const curWeekDay = dayjs().day() + 1;
    const curTime = dayjs().format("HH:mm");
    this.setData({
      openTimeList: openTimeList.map((item) => {
        if (curWeekDay >= item.startWeekDay && curWeekDay <= item.endWeekDay) {
          const timeFrameIdx = item.timeFrameList.findIndex((timeFrame) => {
            const _curTime = +curTime.replace(":", "");
            const _openTime = +timeFrame.openTime.replace(":", "");
            const _closeTime = +timeFrame.closeTime.replace(":", "");
            return _curTime >= _openTime && _curTime <= _closeTime;
          });
          this.setData({ openStatus: timeFrameIdx !== -1 });
        }
        return {
          startWeekDay: weekDayList.find(
            (week) => week.value == item.startWeekDay
          ).text,
          endWeekDay: weekDayList.find((week) => week.value == item.endWeekDay)
            .text,
          timeFrameDesc: item.timeFrameList
            .map((timeFrame) => `${timeFrame.openTime}-${timeFrame.closeTime}`)
            .join(),
        };
      }),
      telList,
      facilityList,
    });
    this.setMenuChangeLimitList();
  },

  setMenuChangeLimitList() {
    const query = wx.createSelectorQuery();
    query.selectAll(".card").boundingClientRect();
    query.exec((res) => {
      this.menuChangeLimitList = res[0].map(
        (item) => item.top + (this.scrollTop || 0)
      );
    });
  },

  selectMenu(e) {
    const { index } = e.currentTarget.dataset;
    wx.pageScrollTo({
      scrollTop: this.menuChangeLimitList[index] - 56,
    });
  },

  onPageScroll({ scrollTop }) {
    this.scrollTop = scrollTop;

    const menuLimit = scrollTop + 56;
    if (menuLimit < this.menuChangeLimitList[1]) {
      if (this.data.curMenuIdx !== 0) this.setData({ curMenuIdx: 0 });
    } else if (
      menuLimit >= this.menuChangeLimitList[1] &&
      menuLimit < this.menuChangeLimitList[2]
    ) {
      if (this.data.curMenuIdx !== 1) this.setData({ curMenuIdx: 1 });
    } else if (menuLimit >= this.menuChangeLimitList[2]) {
      if (this.data.curMenuIdx !== 2) this.setData({ curMenuIdx: 2 });
    }
  },
});
