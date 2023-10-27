import FanService from "./utils/fanService";

const fanService = new FanService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIdx: 0,
    followList: [],
    followFinished: false,
    fanList: [],
    fanFinished: false,
  },

  onLoad({ scene }) {
    const curMenuIdx = scene === "1" ? 0 : 1;
    this.setData({ curMenuIdx }, () => {
      this.setList(true);
    });
  },

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curMenuIdx }, () => {
      const { followFinished, fanFinished } = this.data;
      if (
        (curMenuIdx === 0 && !followFinished) ||
        (curMenuIdx === 1 && !fanFinished)
      ) {
        this.setList(true);
      }
    });
  },

  onPullDownRefresh() {
    this.setList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setList();
  },

  setList(init = false) {
    if (this.data.curMenuIdx) {
      this.setFanList(init);
    } else {
      this.setFollowList(init);
    }
  },

  async setFollowList(init = false) {
    if (init) {
      this.followPage = 0;
      this.setData({ followFinished: false });
    }
    const { followFinished, followList } = this.data;

    if (!followFinished) {
      const { list = [] } =
        (await fanService.getFollowList({
          authorId: this.authorId,
          page: ++this.followPage,
          loadingTitle: "加载中...",
        })) || {};
      this.setData({
        followList: init ? list : [...followList, ...list],
      });
      if (!list.length) {
        this.setData({ followFinished: true });
      }
    }
  },

  async setFanList(init = false) {
    if (init) {
      this.fanPage = 0;
      this.setData({ fanFinished: false });
    }
    const { fanFinished, fanList } = this.data;

    if (!fanFinished) {
      const { list = [] } =
        (await fanService.getFanList({
          authorId: this.authorId,
          page: ++this.fanPage,
          loadingTitle: "加载中...",
        })) || {};
      this.setData({
        fanList: init ? list : [...fanList, ...list],
      });
      if (!list.length) {
        this.setData({ fanFinished: true });
      }
    }
  },
});
