import NewYearService from "../../utils/newYearService";

const newYearService = new NewYearService();

Component({
  properties: {
    addressId: Number,
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          this.setTaskList();
        }
      }
    }
  },

  data: {
    taskList: []
  },

  methods: {
    async setTaskList() {
      const taskList = await newYearService.getTaskList();
      this.setData({ taskList });
    },

    finishTask(e) {
      const { type, param } = e.currentTarget.dataset;
      if (type === 1) {
        if (param.includes("tab-bar-pages")) {
          wx.switchTab({ url: param });
        } else {
          wx.navigateTo({ url: param });
        }
      } else {
      }
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
