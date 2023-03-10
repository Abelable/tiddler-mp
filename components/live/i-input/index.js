import { store } from "../../../store/index";
import tim from "../../../utils/tim/index";
import BaseService from "../../../services/baseService";

const baseService = new BaseService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    roomInfo: Object,
    identity: {
      type: Number,
      value: 1,
    },
  },

  data: {
    containerBottom: 0,
    focus: true,
  },

  methods: {
    // 消息输入
    bindInput(e) {
      this.content = e.detail.value;
    },

    setContainerBottom(e) {
      this.setData({
        containerBottom: e.detail.height,
      });
    },

    setFocus() {
      this.setData({ focus: true });
    },

    // 过滤消息
    filterMsg() {
      if (!this.content) {
        wx.showToast({ icon: "none", title: "消息不能为空" });
        return;
      }
      this.sendMessage(this.content);
      this.content = "";
      this.triggerEvent("hide");
    },

    sendPhrase(e) {
      this.sendMessage(e.currentTarget.dataset.phrase);
      this.triggerEvent("hide");
    },

    // 发送消息
    async sendMessage(content) {
      const { roomInfo, identity } = this.properties;
      const { id, groupId } = roomInfo;
      const { id: userId, nickname, avatar } = store.userInfo;
      const chatMsg = { identity, userId, nickname, avatar, content };
      store.setLiveMsgList(chatMsg);
      tim.sendLiveChatMsg(groupId, chatMsg);
      baseService.saveLiveChatMsg(id, content, identity);
    },
  },
});
