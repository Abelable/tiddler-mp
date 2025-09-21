import { createStoreBindings } from "mobx-miniprogram-bindings";
import * as TextEncoding from "text-encoding-shim";
import { store } from "../../../../store/index";
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    containerBottom: 0,
    scrollTop: "",
    content: "",
    msgList: []
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"]
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

  chatWithTip(e) {
    if (this.replying) {
      wx.showToast({ title: "回答中，请稍后", icon: "none" });
      return;
    }

    const { tip } = e.detail;
    this.connectToAi(tip);
  },

  sendMsg() {
    if (this.replying) {
      wx.showToast({ title: "回答中，请稍后", icon: "none" });
      return;
    }

    const { content } = this.data;
    if (!content) {
      wx.showToast({ title: "请输入您想咨询的内容", icon: "none" });
      return;
    }

    this.connectToAi(content);
    this.setData({ content: "" });
    this.blurInput();
  },

  connectToAi(content) {
    this.replying = true;
    this.setData({
      msgList: [
        ...this.data.msgList,
        {
          self: true,
          content
        },
        {
          loading: true,
          content: "",
          productType: 0,
          productList: []
        }
      ]
    });

    const token = wx.getStorageSync("token");
    this.requestTask = wx.request({
      url: "https://api.tiddler.cn/api/v1/ai/stream",
      enableChunked: true,
      header: { Authorization: token ? `Bearer ${token}` : "" },
      method: "post",
      data: { query: content, conversationId: this.conversationId }
    });

    this.requestTask.onChunkReceived(res => {
      const { msgList } = this.data;
      this.setData({
        [`msgList[${msgList.length - 1}].loading`]: false
      });

      const str = new TextEncoding.TextDecoder("utf-8").decode(
        new Uint8Array(res.data)
      );

      if (str.includes("done: ")) {
        const { conversationId, productType, productList } = JSON.parse(
          str.replace("done: ", "")
        );
        if (!this.conversationId) {
          this.conversationId = conversationId;
        }
        this.setData({
          [`msgList[${msgList.length - 1}].productType`]: productType,
          [`msgList[${msgList.length - 1}].productList`]: productList
        });
        this.replying = false;
      } else {
        const { content } = msgList[msgList.length - 1];
        this.setData({
          [`msgList[${msgList.length - 1}].content`]: `${content}${str}`
        });
      }
    });
  },

  onUnload() {
    if (this.requestTask) {
      this.requestTask.offChunkReceived();
    }
    this.storeBindings.destroyStoreBindings();
  }
});
