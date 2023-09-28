import { weekDayList } from "../../../../../../../../utils/index";

Page({
  data: {
    menuList: [
      { name: "营业时间", scene: "openTime" },
      { name: "联系电话", scene: "tel" },
    ],
    curMenuIdx: 0,
    openTimeList: [],
    telList: [],
  },

  async onLoad({ info }) {
    const { name, openTimeList, telList } = JSON.parse(info);
    wx.setNavigationBarTitle({ title: name });
    this.setData({
      openTimeList: openTimeList.map((item) => ({
        startWeekDay: weekDayList.find(
          (week) => week.value == item.startWeekDay
        ).text,
        endWeekDay: weekDayList.find((week) => week.value == item.endWeekDay)
          .text,
        timeFrameDesc: item.timeFrameList
          .map((timeFrame) => `${timeFrame.openTime}-${timeFrame.closeTime}`)
          .join(),
      })),
      telList,
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
    } else if (menuLimit >= this.menuChangeLimitList[1]) {
      if (this.data.curMenuIdx !== 6) this.setData({ curMenuIdx: 1 });
    }
  },
});
