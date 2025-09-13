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
          loadingTitle: "正在加载",
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
          loadingTitle: "正在加载",
        })) || {};
      this.setData({
        fanList: init ? list : [...fanList, ...list],
      });
      if (!list.length) {
        this.setData({ fanFinished: true });
      }
    }
  },

  toggleFollowStatus(e) {
    const { id, status, index } = e.currentTarget.dataset
    if (status == 0) {
      fanService.followAuthor(id, () => {
        this.setData({
          [`followList[${index}].status`]: 1
        });
      })
    } else {
      fanService.cancelFollowAuthor(id, () => {
        this.setData({
          [`followList[${index}].status`]: 0
        });
      })
    }
  },

  toggleFanStatus(e) {
    const { id, status, index } = e.currentTarget.dataset
    if (status == 1) {
      fanService.followAuthor(id, () => {
        this.setData({
          [`fanList[${index}].status`]: 2
        });
      })
    } else {
      fanService.cancelFollowAuthor(id, () => {
        this.setData({
          [`fanList[${index}].status`]: 1
        });
      })
    }
  },

  navToUserCenter(e) {
    const url = `/pages/subpages/home/media/author-center/index?id=${e.currentTarget.dataset.id}`;
    wx.navigateTo({ url });
  },
});
