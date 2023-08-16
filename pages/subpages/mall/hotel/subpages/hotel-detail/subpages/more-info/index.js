Page({
  data: {
    hotelInfo: null,
    curMenuIdx: 0,
  },

  onLoad({ info }) {
    const hotelInfo = JSON.parse(info);
    this.setData({ hotelInfo });
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
    } else if (
      menuLimit >= this.menuChangeLimitList[2] &&
      menuLimit < this.menuChangeLimitList[3]
    ) {
      if (this.data.curMenuIdx !== 2) this.setData({ curMenuIdx: 2 });
    } else if (menuLimit >= this.menuChangeLimitList[3]) {
      if (this.data.curMenuIdx !== 6) this.setData({ curMenuIdx: 6 });
    }
  },
});
