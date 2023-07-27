import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";

Page({
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
