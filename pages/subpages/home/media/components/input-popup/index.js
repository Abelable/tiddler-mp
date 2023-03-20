import { store } from "../../../../../../store/index";
import tim from "../../../../../../utils/tim/index";
import {
  SCENE_LIVE,
  SCENE_VIDEO,
  SCENE_NOTE,
} from "../../../../../../utils/emuns/inputScene";
import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    scene: {
      type: Number,
      value: 1
    },
    roomInfo: Object,
    identity: {
      type: Number,
      value: 1,
    },
    videoId: Number,
    noteId: Number,
    commentId: Number,
  },

  data: {
    containerBottom: 0,
    focus: true,
  },

  methods: {
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
      this.triggerEvent("hide");
    },

    // 发送消息
    async sendMessage(content) {
      const { scene, roomInfo, identity, videoId, noteId, commentId } = this.properties;

      switch (scene) {
        case SCENE_LIVE:
          const { id, groupId } = roomInfo;
          const { id: userId, nickname, avatar } = store.userInfo;
          const chatMsg = { identity, userId, nickname, avatar, content };
          store.setLiveMsgList(chatMsg);
          tim.sendLiveChatMsg(groupId, chatMsg);
          mediaService.saveLiveChatMsg(id, content, identity);
          break;
      
        case SCENE_VIDEO:
          
          break;

        case SCENE_NOTE:
          
          break;
      }
    },
  },
});
