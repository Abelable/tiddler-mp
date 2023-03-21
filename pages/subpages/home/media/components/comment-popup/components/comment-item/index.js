import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../../store/index";

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"],
  },

  properties: {
    mediaType: Number,
    item: Object,
    index: Number,
    replyIndex: Number,
    isReply: Boolean,
    authorId: Number,
  },

  methods: {
    reply() {
      const { id, userInfo, index, replyIndex } = this.properties.item;
      this.triggerEvent("reply", {
        commentId: id,
        index,
        replyIndex,
        nickname: userInfo.nickname,
      });
    },

    delete() {
      const { item, index, replyIndex, isReply } = this.properties;
      this.triggerEvent("delete", {
        commentId: item.id,
        index,
        replyIndex,
        isReply,
      });
    },
  },
});
