import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight
  },
  
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});