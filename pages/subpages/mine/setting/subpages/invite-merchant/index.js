import { store } from "../../../../../../store/index";
import TaskService from "./utils/taskService";

const taskService = new TaskService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false,
    curMenuIdx: 0,
    menuFixed: false,
    taskList: [],
    finished: false
  },

  async onLoad() {
    await this.setTaskList(true);
    this.getMenuTop();
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
    this.setTaskList(true);
  },

  getMenuTop() {
    const query = wx.createSelectorQuery();
    query.select(".menu-list").boundingClientRect();
    query.exec(res => {
      if (res[0] !== null) {
        this.menuTop = res[0].top - statusBarHeight - 44;
      }
    });
  },

  onPullDownRefresh() {
    this.setTaskList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setTaskList();
  },

  async setTaskList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    const { curMenuIdx, taskList } = this.data;
    const { list = [] } =
      (await taskService.getTaskList(curMenuIdx + 1, ++this.page)) || {};
    this.setData({ taskList: init ? list : [...taskList, ...list] });

    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.headerVisible) {
        this.setData({ headerVisible: true });
      }
    } else {
      if (this.data.headerVisible) {
        this.setData({ headerVisible: false });
      }
    }

    if (!this.data.menuFixed && e.scrollTop >= this.menuTop) {
      this.setData({ menuFixed: true });
    }
    if (this.data.menuFixed && e.scrollTop < this.menuTop) {
      this.setData({ menuFixed: false });
    }
  },

  checkGuide() {
    wx.navigateTo({
      url: "./subpages/guide/index"
    });
  },

  checkMineTask() {
    wx.navigateTo({
      url: "./subpages/mine-task/index"
    });
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath = "/pages/subpages/mine/setting/subpages/invite-merchant/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return {
      path,
      title: "邀商家入驻，拿百元奖励",
      imageUrl: "https://static.tiddler.cn/mp/invite_merchant/share_cover.png"
    };
  },

  onShareTimeline() {
    const { id } = store.superiorInfo || {};
    const query = id ? `superiorId=${id}` : "";
    return {
      query,
      title: "邀商家入驻，拿百元奖励",
      imageUrl: "https://static.tiddler.cn/mp/invite_merchant/share_cover.png"
    };
  }
});
