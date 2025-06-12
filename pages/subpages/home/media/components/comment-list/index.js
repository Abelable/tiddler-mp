Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    commentList: Array,
    authorId: Number
  },

  methods: {
    async toggleRepliesVisible(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent("toggleRepliesVisible", { index });
    },

    reply(e) {
      this.triggerEvent("reply", e.detail);
    },

    delete(e) {
      this.triggerEvent("delete", e.detail);
    },
  }
});
