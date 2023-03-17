import { checkLogin } from "../../../../../../utils/index";
import LiveService from "../../../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  options: {
    addGlobalClass: true,
  },
  
  properties: {
    roomInfo: {
      type: Object,
      observer(info) {
        if (info) {
          this.setCountDown(new Date(info.noticeTime).getTime())
        }
      },
    },
  },

  data: {
    statusBarHeight,
    time: 0,
  },

  detached() {
    clearInterval(this.countDownInterval);
  },

  methods: {
    share() {
      this.triggerEvent("share", { type: "poster" });
    },

    toggleSubscribe() {
      checkLogin(() => {
        const { id, previewDestine } = this.properties.roomInfo;
        if (previewDestine == 0) {
          liveService.subscribeAnchor(
            id,
            (data) => {
              if (data) {
                wx.showToast({ title: "订阅成功", icon: "none" });
                this.setData({ ["roomInfo.previewDestine"]: 1 });
              }
            },
            (err) => {
              err && wx.showToast({ title: err.data.message, icon: "none" });
            }
          );
        } else {
          liveService.unSubscribeAnchor(
            id,
            (data) => {
              if (data) {
                wx.showToast({ title: "取消订阅成功", icon: "none" });
                this.setData({ ["roomInfo.previewDestine"]: 0 });
              }
            },
            (err) => {
              err && wx.showToast({ title: err.data.message, icon: "none" });
            }
          );
        }
      });
    },

    setCountDown(startTime) {
      const currentTime = (new Date()).getTime()
      let countDown = (startTime - currentTime) / 1000
      this.setData({ countDown })
      this.countDownInterval = setInterval(() => {
        if (countDown > 0) {
          --countDown
          this.setData({ countDown })
        } else clearInterval(this.countDownInterval)
      }, 1000)
    },
  },
});
