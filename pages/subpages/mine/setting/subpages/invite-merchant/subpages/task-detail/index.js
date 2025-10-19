import dayjs from "dayjs";
import { calcDistance } from "../../../../../../../../utils/index";
import { store } from "../../../../../../../../store/index";
import TaskService from "../../utils/taskService";

const taskService = new TaskService();

Page({
  data: {
    taskInfo: null,
    distance: "",
    countdown: 0,
    qrCode: "",
    effectiveTime: "",
    receiveBtnActive: false
  },

  onLoad({ id }) {
    this.taskId = id;
    this.setTaskInfo();
  },

  async setTaskInfo() {
    const taskInfo = await taskService.getTaskDetail(this.taskId);
    this.setData({ taskInfo });

    const { status, step, longitude, latitude, pickTime, finishTime } =
      taskInfo;

    this.setDistance(longitude, latitude);

    if (status === 1 && step === 0) {
      await this.setQrcode();
      const effectiveTime = dayjs(
        dayjs(pickTime).valueOf() + 24 * 60 * 60 * 1000
      ).format("YYYY-MM-DD HH:mm:ss");
      this.setData({ effectiveTime });

      this.setCountdown(pickTime);
    }

    if (step === 4 && dayjs().diff(dayjs(finishTime), "day") >= 14) {
      this.setData({ receiveBtnActive: true });
    }
  },

  setDistance(lo2, la2) {
    if (store.locationInfo) {
      const { longitude: lo1 = 0, latitude: la1 = 0 } =
        store.locationInfo || {};
      const distance = lo1 ? calcDistance(la1, lo1, la2, lo2) : 0;
      this.setData({ distance });
    }
  },

  setCountdown(pickTime) {
    const countdown = Math.floor(
      (dayjs(pickTime).valueOf() + 24 * 60 * 60 * 1000 - dayjs().valueOf()) /
        1000
    );
    this.setData({ countdown });
    this.countdownInterval = setInterval(() => {
      if (this.data.countdown <= 0) {
        this.cancelTask();
        return;
      }
      this.setData({
        countdown: this.data.countdown - 1
      });
    }, 1000);
  },

  async setQrcode() {
    const { merchantType, taskId } = this.data.taskInfo;
    const scene = `${merchantType}-${store.userInfo.id}-${taskId}`;
    const page = "pages/subpages/mine/setting/subpages/merchant-settle/index";
    const qrCode = await taskService.getQrCode(scene, page);
    this.setData({ qrCode });
  },

  cancelTask() {
    const { taskId } = this.data.taskInfo;
    taskService.cancelTask(taskId, () => {
      clearInterval(this.countdownInterval);
      this.setTaskInfo();
    });
  },

  repickTask() {
    const { taskId } = this.data.taskInfo;
    taskService.pickTask(taskId, () => {
      this.setTaskInfo();
    });
  },

  // todo
  receiveReward() {
    const { taskInfo, receiveBtnActive } = this.data;
    if (!receiveBtnActive) {
      return;
    }
    if (taskInfo.status === 1) {
    } else {
    }
  },

  navigate() {
    const { merchantName, address, latitude, longitude } = this.data.taskInfo;
    wx.openLocation({
      latitude: +latitude,
      longitude: +longitude,
      name: merchantName,
      address
    });
  },

  consult() {
    const { tel: phoneNumber } = this.data.taskInfo;
    wx.makePhoneCall({ phoneNumber });
  },

  onUnload() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
});
