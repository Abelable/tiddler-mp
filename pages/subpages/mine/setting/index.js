import { WEBVIEW_BASE_URL } from "../../../../config";
import { store } from "../../../../store/index";
import { checkLogin } from "../../../../utils/index";

Page({
  data: {
    version: "1.0.0",
    toolVisible: false // todo 用于前期提交审核隐藏部分功能，后期需要删除
  },

  onLoad() {
    // todo 用于前期提交审核隐藏部分功能，后期需要删除
    // const { version = "1.0.0", envVersion } =
    //   wx.getAccountInfoSync().miniProgram || {};
    // if (envVersion === "release") {
    //   this.setData({ version, toolVisible: true });
    // }
    this.setData({ toolVisible: true });
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

  settleIn(e) {
    checkLogin(() => {
      wx.navigateTo({
        url: "/pages/subpages/mine/setting/subpages/merchant-settle/index"
      });
    }, true);
  },

  inviteMerchant() {
    checkLogin(() => {
      wx.navigateTo({
        url: "/pages/subpages/mine/setting/subpages/invite-merchant/index"
      });
    }, true);
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
