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
    effectiveTime: ""
  },

  onLoad({ id }) {
    this.taskId = id;
    this.setTaskInfo();
  },

  async setTaskInfo() {
    const taskInfo = await taskService.getTaskDetail(this.taskId);
    this.setData({ taskInfo });

    const { status, step, createdAt, longitude, latitude } = taskInfo;

    this.setDistance(longitude, latitude);

    if (status === 1 && step === 0) {
      this.setCountdown(createdAt);

      this.setQrcode();

      const effectiveTime = dayjs(
        dayjs(createdAt).valueOf() + 24 * 60 * 60 * 1000
      ).format("YYYY-MM-DD HH:mm:ss");
      this.setData({ effectiveTime });
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

  setCountdown(createdAt) {
    const countdown = Math.floor(
      (dayjs(createdAt).valueOf() + 24 * 60 * 60 * 1000 - dayjs().valueOf()) /
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
    const { productType, taskId } = this.data.taskInfo
    const scene = `${productType}-${store.userInfo.id}-${taskId}`;
    const page = "pages/subpages/mine/setting/subpages/merchant-settle/index";
    const qrCode = await taskService.getQrCode(scene, page);
    this.setData({ qrCode });
  },

  cancelTask() {
    const { taskId } = this.data.taskInfo;
    taskService.cancelTask(taskId, () => {
      this.setData({
        ["taskInfo.status"]: 6,
        ["taskInfo.taskStatus"]: 1
      });
      clearInterval(this.countdownInterval);
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
    if (this.data.taskInfo.status === 1) {
    } else {
    }
  },

  navigate() {
    const { productName, address, latitude, longitude } = this.data.taskInfo;
    wx.openLocation({
      latitude: +latitude,
      longitude: +longitude,
      name: productName,
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
