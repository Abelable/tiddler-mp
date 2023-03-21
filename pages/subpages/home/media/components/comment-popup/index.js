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

      const { videoId, finished } = this.data;

      if (!finished) {
        const { list = [] } =
          (await mediaService.getVideoCommentList(videoId, ++this.page)) || {};
        const commentList = list.map((item) => ({
          ...item,
          replies: [],
          repliesVisible: false,
        }));
        this.setData({
          commentList: init
            ? commentList
            : [...this.data.commentList, ...commentList],
        });

        if (!commentList.length) {
          this.setData({ finished: true });
        }
      }
    },

    async setNoteCommentList(init = false) {
      if (init) {
        this.setData({ finished: false });
        this.page = 0;
      }

      const { noteId, finished } = this.data;

      if (!finished) {
        const { list = [] } =
          (await mediaService.getNoteCommentList(noteId, ++this.page)) || {};
        const commentList = list.map((item) => ({
          ...item,
          replies: [],
          repliesVisible: false,
        }));
        this.setData({
          commentList: init
            ? commentList
            : [...this.data.commentList, ...commentList],
        });

        if (!commentList.length) {
          this.setData({ finished: true });
        }
      }
    },

    async toggleRepliesVisible(e) {
      const { index } = e.currentTarget.dataset;
      if (!this.replyPageArr) this.replyPageArr = [];
      if (!this.replyPageArr[index]) this.replyPageArr[index] = 0;

      const { id, replies, replayCount, repliesVisble } =
        this.data.commentList[index];
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

    delete(e) {
      const { commentId, index, replyIndex, isReply } = e.detail;

      switch (this.properties.mediaType) {
        case VIDEO:
          wx.showModal({
            content: "确定删除该评论吗",
            showCancel: true,
            success: (result) => {
              if (result.confirm) {
                mediaService.deleteVideoComment(commentId, (res) => {
                  const total = res.data;
                  if (isReply) {
                    const { replies } = this.data.commentList[index];
                    replies.splice(replyIndex, 1);
                    this.setData({
                      total,
                      [`commentList${index}.replies`]: replies,
                    });
                  } else {
                    const { commentList } = this.data;
                    commentList.splice(index, 1);
                    this.setData({ total, commentList });
                  }
                });
              }
            },
          });

          break;

        case NOTE:
          this.setNoteCommentList();
          break;
      }
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
