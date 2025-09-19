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

  sendMsg() {
    const { content, msgList } = this.data;
    if (!content) {
      wx.showToast({ title: "请输入您想咨询的内容" });
      return;
    }

    this.setData({
      msgList: [
        ...msgList,
        {
          self: true,
          content
        },
        {
          content: "",
          productType: 0,
          productList: []
        }
      ],
      content: ""
    });

    this.connectToAi(content);
    this.blurInput();
  },

  connectToAi(query) {
    const token = wx.getStorageSync("token");
    this.requestTask = wx.request({
      url: "https://api.tiddler.cn/api/v1/ai/stream",
      enableChunked: true,
      header: { Authorization: token ? `Bearer ${token}` : "" },
      method: "post",
      data: { query }
    });

    this.requestTask.onChunkReceived(res => {
      const str = new TextEncoding.TextDecoder("utf-8").decode(
        new Uint8Array(res.data)
      );

      console.log('onChunkReceived', str)
      const { msgList } = this.data;

      if (str.includes("done: ")) {
        const { type, list } = JSON.parse(str.replace("done: ", ""));
        this.setData({
          [`msgList[${msgList.length - 1}].productType`]: type,
          [`msgList[${msgList.length - 1}].productList`]: list
        });
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
