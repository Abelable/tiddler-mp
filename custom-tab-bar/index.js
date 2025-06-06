import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../store/index";

const { windowHeight, safeArea } = getApp().globalData.systemInfo;
const safeAreaInsetBottom = Math.max(windowHeight - safeArea.bottom - 20, 10);

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["tabType"]
  },

  data: {
    safeAreaInsetBottom
  },

  methods: {
    switchTab(e) {
      wx.switchTab({ url: e.currentTarget.dataset.path });
    }
  }
});
