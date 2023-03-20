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
      this.triggerEvent("reply", { id, nickname: userInfo.nickname });
    },
  },
});
