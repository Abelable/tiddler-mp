import NewYearService from "../../utils/newYearService";

const newYearService = new NewYearService();

Component({
  properties: {
    addressId: Number,
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          this.init();
        }
      }
    }
  },

  pageLifetimes: {
    show() {
      if (this.properties.show) {
        this.init();
      }
    }
  },

  data: {
    invitedUserList: [{}, {}, {}, {}, {}],
    invitedUserCount: 0,
    taskList: []
  },

  methods: {
    init() {
      this.setInvitedUserList();
      this.setTaskList();
    },

    async setInvitedUserList() {
      const list = await newYearService.getTodayNewCustomerList();
      const invitedUserList = list.slice(0, 4);
      while (invitedUserList.length < 4) {
        invitedUserList.push({});
      }
      this.setData({
        invitedUserList,
        invitedUserCount: Math.min(list.length, 4)
      });
    },

    async setTaskList() {
      const taskList = await newYearService.getTaskList();
      this.setData({ taskList });
    },

    finishTask(e) {
      const { status, scene, param } = e.currentTarget.dataset;

      if (status !== 1) {
        return;
      }

      if (scene === 1) {
        if (param.includes("tab-bar-pages")) {
          wx.switchTab({ url: param });
        } else {
          wx.navigateTo({ url: param });
        }
      }
    },

    async joinGroupCallback(e) {
      if (e.detail.errcode === -3006) {
        await newYearService.finishTask(4)
        this.init()
      }
    },

    share() {
      if (this.data.invitedUserCount === 4) {
        return
      }
      this.triggerEvent("share");
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
