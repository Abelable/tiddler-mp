import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../store/index";
import LiveService from "../../utils/liveService";

const liveService = new LiveService();

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["audienceCount"],
  },

  properties: {
    isLivePush: Boolean,
    anchorInfo: Object,
    isFollow: Boolean,
  },

  methods: {
    followAnchor() {
      liveService.followAuthor(this.properties.anchorInfo.id, () => {
        this.setData({
          isFollow: true,
        });
      });
    },

    subscribeAnchor() {
      liveService.subscribeAnchor(this.properties.anchorInfo.id, () => {
        wx.showToast({
          title: "订阅成功",
          icon: "none",
        });
      });
    },
  },
});
