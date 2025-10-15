import TaskService from "../../utils/taskService";

const taskService = new TaskService();

Page({
  data: {
    taskData: null,
    curMenuIdx: 0,
    taskList: [],
    finished: false
  },

  onLoad() {
    this.setTaskData();
    this.setTaskList(true);
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
    this.setTaskList(true);
  },

  onPullDownRefresh() {
    this.setTaskList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setTaskList();
  },

  async setTaskData() {
    const taskData = await taskService.getUserTaskData();
    this.setData({ taskData });
  },

  async setTaskList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    const { curMenuIdx, taskList } = this.data;
    const { list = [] } =
      (await taskService.getUserTaskList(curMenuIdx, ++this.page)) || {};
    this.setData({ taskList: init ? list : [...taskList, ...list] });

    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  checkRecord() {
    wx.navigateTo({
      url: "../reward-decord/index"
    });
  }
});
