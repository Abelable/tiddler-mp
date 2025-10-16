import TaskService from "../../utils/taskService";

const taskService = new TaskService();

Page({
  data: {
    steps: [
      {
        text: "步骤一",
        desc: "描述信息",
        inactiveIcon: "location-o",
        activeIcon: "success"
      },
      {
        text: "步骤二",
        desc: "描述信息",
        inactiveIcon: "like-o",
        activeIcon: "plus"
      },
      {
        text: "步骤三",
        desc: "描述信息",
        inactiveIcon: "star-o",
        activeIcon: "cross"
      },
      {
        text: "步骤四",
        desc: "描述信息",
        inactiveIcon: "phone-o",
        activeIcon: "fail"
      }
    ],
    curStep: 1,
    qrCode: ""
  },

  onLoad() {
    this.setQrcode()
  },

  async setQrcode() {
    const page = "pages/subpages/home/media/author-center/index";
    const qrCode = await taskService.getQrCode("1", page);
    this.setData({ qrCode });
  }
});
