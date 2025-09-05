import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo", "superiorInfo", "contactList"]
  },

  data: {
    statusBarHeight
  },

  pageLifetimes: {
    show() {
      store.setTabType("notice");
    }
  },

  methods: {
    chat(e) {
      const { friendId, friendName, friendAvatarUrl } =
        e.currentTarget.dataset.info;
      const url = `/pages/subpages/notice/chat/index?userId=${friendId}&name=${friendName}&avatar=${friendAvatarUrl}`;
      wx.navigateTo({ url });
    }
  }
});
