import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import AiChatService from "./utils/aiChatService";

const aiChatService = new AiChatService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    containerBottom: 0,
    scrollTop: "",
    content: "",
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo", "msgList"]
    });
  },

  showKeyBoard(e) {
    const { containerBottom } = this.data;
    !containerBottom && this.setData({ containerBottom: e.detail.height });
  },

  hideKeyBoard() {
    this.data.containerBottom && this.setData({ containerBottom: 0 });
  },

  blurInput() {
    const { containerBottom } = this.data;
    containerBottom && this.setData({ containerBottom: 0 });
  },

  getContent(e) {
    this.setData({
      content: e.detail.value
    });
  },

  sendMsg() {
    const { content, friendId } = this.data;
    if (content) {
      this.setData({ content: "" });
      this.blurInput();
    } else wx.showToast({ title: "消息不能为空" });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
