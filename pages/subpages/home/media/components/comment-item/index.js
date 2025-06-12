import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";

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
    item: Object,
    index: Number,
    replyIndex: Number,
    isReply: Boolean,
    authorId: Number,
  },

  methods: {
    navToUserCenter() {
      const { id } = this.properties.item.userInfo;
      if (store.userInfo.id !== id) {
        wx.navigateTo({
          url: `/pages/subpages/home/media/author-center/index?id=${id}`,
        });
      }
    },

    reply() {
      const { item, index } = this.properties;
      const { id: commentId, userInfo } = item;
      const { nickname } = userInfo;
      this.triggerEvent("reply", { commentId, index, nickname });
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
