import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo", "promoterInfo"]
  },

  data: {
    statusBarHeight
  },

  pageLifetimes: {
    show() {
      store.setTabType("notice");
    }
  }
});
