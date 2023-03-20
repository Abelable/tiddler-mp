import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { VIDEO, NOTE } from "../../../../../../utils/emuns/mediaType";
import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    actions: [],
  },

  properties: {
    mediaType: Number,
    videoId: Number,
    noteId: Number,
    authorId: Number,
    total: Number,
  },

  data: {
    commentList: [],
    finished: false,
  },

  lifetimes: {
    attached() {
      this.init();
    },
  },

  methods: {
    init() {
      switch (this.properties.mediaType) {
        case VIDEO:
          this.setVideoCommentList(true);
          break;

        case NOTE:
          this.setNoteCommentList(true);
          break;
      }
    },

    loadMore() {
      switch (this.properties.mediaType) {
        case VIDEO:
          this.setVideoCommentList();
          break;

        case NOTE:
          this.setNoteCommentList();
          break;
      }
    },

    async setVideoCommentList(init = false) {
      if (init) {
        this.setData({ finished: false });
        this.page = 0;
      }

      const { videoId, commentList, finished } = this.data;

      if (!finished) {
        const { list = [] } =
          (await mediaService.getVideoCommentList(videoId, ++this.page)) || {};
        this.setData({
          commentList: init ? list : [...commentList, ...list],
        });

        if (!list.length) {
          this.setData({ finished: true });
        }
      }
    },

    async setNoteCommentList(init = false) {
      if (init) {
        this.setData({ finished: false });
        this.page = 0;
      }

      const { noteId, commentList, finished } = this.data;

      if (!finished) {
        const { list = [] } =
          (await mediaService.getNoteCommentList(noteId, ++this.page)) || {};
        this.setData({
          commentList: init ? list : [...commentList, ...list],
        });

        if (!list.length) {
          this.setData({ finished: true });
        }
      }
    },

    spreadReply(e) {
      const { index } = e.currentTarget.dataset;
      this.toggleSpread(index);
    },

    async toggleSpread(index) {
      if (!this.replyPageArr[index]) this.replyPageArr[index] = 0;

      const {
        id: parentId,
        replyLists,
        comment_num: replayCount,
        replyFold,
      } = this.data.commentList[index];
      if (replayCount > replyLists.length) {
        const { list } = await mediaService.getSecondCommentsLists({
          parentId,
          page: ++this.replyPageArr[index],
        });
        if (replyFold)
          this.setData({ [`commentList[${index}].replyFold`]: false });
        this.setData({
          [`commentList[${index}].replyLists`]: [...replyLists, ...list],
        });
      }
      if (replayCount == replyLists.length) {
        this.setData({ [`commentList[${index}].replyFold`]: !replyFold });
      }
    },

    comment() {
      this.triggerEvent("comment");
    },

    reply(e) {
      this.triggerEvent("reply", e.detail);
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
