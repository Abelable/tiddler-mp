import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import BaseService from "../../services/baseService";

const baseService = new BaseService();

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
    videoId: String,
    noteId: String,
  },

  data: {
    totalCount: 0,
    commentList: [],
    finished: false,
  },

  lifetimes: {
    attached() {
      this.setCommentList();
    },
  },

  methods: {
    async setCommentList() {
      const limit = 10;
      const { videoId, noteId, totalCount, commentList, finished } = this.data;
      if (!this.page) this.page = 0;

      if (!finished) {
        const { total = 0, list = [] } =
          (await baseService[`get${videoId ? "Video" : "Note"}CommentList`](
            videoId || noteId,
            ++this.page,
            limit
          )) || {};
        this.setData({
          commentList: [...commentList, ...list],
        });
        if (!totalCount) {
          this.setData({ totalCount: total });
        }
        if (list.length < limit) {
          this.setData({ finished: true });
        }
      }
    },

    async setVideoCommentList(init = false) {
      if (init) {
        this.setData({ finished: false });
        this.page = 0;
      }

      const limit = 10;
      const { videoId, commentList, finished } = this.data;

      if (!finished) {
        const { total = 0, list = [] } =
          (await baseService.getVideoCommentList(
            videoId,
            ++this.page,
            limit
          )) || {};
        if (init) {
          this.setData({ total });
        }
        this.setData({
          commentList: init ? list : [...commentList, ...list],
        });

        if (list.length < limit) {
          this.setData({ finished: true });
        }
      }
    },

    async setNoteCommentList(init = false) {
      if (init) {
        this.setData({ finished: false });
        this.page = 0;
      }

      const limit = 10;
      const { videoId, commentList, finished } = this.data;

      if (!finished) {
        const { total = 0, list = [] } =
          (await baseService.getNoteCommentList(videoId, ++this.page, limit)) ||
          {};
        if (init) {
          this.setData({ total });
        }
        this.setData({
          commentList: init ? list : [...commentList, ...list],
        });

        if (list.length < limit) {
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
        const { list } = await baseService.getSecondCommentsLists({
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

    atUser() {
      this.triggerEvent("atUser");
    },

    comment() {
      this.triggerEvent("comment");
    },

    reply(e) {
      this.triggerEvent("atUser", { commentId: e.detail.id });
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
