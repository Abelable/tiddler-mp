import { WEBVIEW_BASE_URL } from "../../config";

Component({
  methods: {
    toAuth() {
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/auth`;
      wx.navigateTo({ url });
      this.hide();
    },

    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});
