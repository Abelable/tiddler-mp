import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../config";
import { checkLogin } from "../../../../utils/index";

Page({
  data: {
    version: "1.0.0",
    toolVisible: false // todo 用于前期提交审核隐藏部分功能，后期需要删除
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"]
    });

    // todo 用于前期提交审核隐藏部分功能，后期需要删除
    const { version = "1.0.0", envVersion } =
      wx.getAccountInfoSync().miniProgram || {};
    if (envVersion === "release") {
      this.setData({ version, toolVisible: true });
    }
  },

  editUserInfo() {
    checkLogin(() => {
      wx.navigateTo({ url: "./subpages/user-info-setting/index" });
    }, true);
  },

  navToAuth() {
    checkLogin(() => {
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/auth`;
      wx.navigateTo({ url });
    }, true);
  },

  setPassword() {
    checkLogin(() => {
      wx.navigateTo({
        url: "./subpages/password-setting/index"
      });
    }, true);
  },

  settleIn() {
    checkLogin(() => {
      wx.navigateTo({
        url: "./subpages/merchant-settle/index"
      });
    }, true);
  },

  feedback() {
    wx.navigateTo({
      url: "./subpages/feedback/index"
    });
  },

  inviteMerchant() {
    checkLogin(() => {
      wx.navigateTo({
        url: "./subpages/invite-merchant/index"
      });
    }, true);
  },

  checkAboutUs() {
    wx.navigateTo({
      url: './subpages/about-us/index'
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const path = id
      ? `/pages/tab-bar-pages/home/index?superiorId=${id}`
      : "/pages/tab-bar-pages/home/index";
    return {
      title: "游千岛湖·上小鱼游",
      path,
      imageUrl: "https://static.tiddler.cn/mp/share_cover.png"
    };
  }
});
