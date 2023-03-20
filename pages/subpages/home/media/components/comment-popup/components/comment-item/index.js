Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    item: Object,
    isReply: Boolean,
    authorId: Number,
  },

  methods: {
    reply() {
      const { id, userInfo } = this.properties.item;
      this.triggerEvent("reply", {
        commentId: id,
        nickname: userInfo.nickname,
      });
    },
  },
});
