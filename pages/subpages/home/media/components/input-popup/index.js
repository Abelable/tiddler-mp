import { store } from "../../../../../../store/index";
import tim from "../../../../../../utils/tim/index";
import { LIVE, VIDEO, NOTE } from "../../../../utils/emuns/mediaType";
import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    mediaType: {
      type: Number,
      value: 1,
    },
    roomInfo: Object,
    identity: {
      type: Number,
      value: 1,
    },
    mediaId: Number,
    commentId: Number,
    nickname: String,
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
    },

    // 发送消息
    async sendMessage(content) {
      const { mediaType, roomInfo, identity, mediaId, commentId } =
        this.properties;

      switch (mediaType) {
        case LIVE:
          const { id, groupId } = roomInfo;
          const { id: userId, nickname, avatar } = store.userInfo;
          const chatMsg = { identity, userId, nickname, avatar, content };
          tim.sendLiveChatMsg(groupId, chatMsg);
          mediaService.saveLiveChatMsg(id, content, identity);
          store.setLiveMsgList(chatMsg);
          this.triggerEvent("finish");
          break;

        case VIDEO:
          mediaService.addVideoComment(mediaId, content, commentId, (res) => {
            this.triggerEvent('finish', res.data)
          });
          break;

        case NOTE:
          mediaService.addNoteComment(mediaId, content, commentId, (res) => {
            this.triggerEvent('finish', res.data)
          });
          break;
      }
    },
  },
});
