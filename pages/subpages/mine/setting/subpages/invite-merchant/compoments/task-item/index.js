import { store } from "../../../../../../../../store/index";
import { calcDistance } from "../../../../../../../../utils/index";
import TaskService from "../../utils/taskService";

const taskService = new TaskService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: {
      type: Object,
      observer(info) {
        if (info) {
          if (store.locationInfo) {
            const { longitude: lo1 = 0, latitude: la1 = 0 } =
              store.locationInfo || {};
            const { longitude: lo2, latitude: la2 } = info;
            const distance = lo1 ? calcDistance(la1, lo1, la2, lo2) : 0;
            this.setData({ distance });
          }

          let status, statusDesc;
          switch (info.status) {
            case 1:
              status = "processing";
              statusDesc = "进行中";
              break;
            case 2:
              status = "warning";
              statusDesc = "待领取奖励";
              break;
            case 3:
              status = "processing";
              statusDesc = "奖励领取中";
              break;
            case 4:
              status = "success";
              statusDesc = "奖励已领取";
              break;
            case 5:
              status = "error";
              statusDesc = "奖励领取失败";
              break;
            default:
              status = "default";
              statusDesc = "已取消";
              break;
          }
          this.setData({ status, statusDesc });
        }
      }
    },
    isUserTask: Boolean
  },

  data: {
    distance: "",
    status: "",
    statusDesc: ""
  },

  methods: {
    navigation() {
      const {
        productName: name,
        address,
        latitude,
        longitude
      } = this.properties.item;
      wx.openLocation({
        latitude: +latitude,
        longitude: +longitude,
        name,
        address
      });
    },

    pick() {
      const { id, status } = this.properties.item;
      if (status === 1) {
        taskService.pickTask(id, () => {
          this.setData({
            ["item.status"]: 2
          });
        });
      } else {
        this.checkDetail();
      }
    },

    checkDetail() {
      const { taskId } = this.properties.item;
      const url = `/pages/subpages/mine/setting/subpages/invite-merchant/subpages/task-detail/index?id=${taskId}`;
      wx.navigateTo({ url });
    }
  }
});
