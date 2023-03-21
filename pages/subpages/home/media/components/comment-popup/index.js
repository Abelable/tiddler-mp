import { VIDEO, NOTE } from "../../../../../../utils/emuns/mediaType";
import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    mediaType: Number,
    curVideoIdx: Number,
    videoId: Number,
    noteId: Number,
    authorId: Number,
    total: Number,
  },

  data: {
    commentList: [],
    finished: false,
    commentId: 0,
    nickname: "",
    inputPopupVisible: false,
  },

  lifetimes: {
    attached() {
      this.setCommentList(true);
    },
  },

  methods: {
    loadMore() {
      this.setCommentList();
    },

    async setCommentList(init = false) {
      if (init) {
        this.setData({ finished: false });
        this.page = 0;
      }

      const { mediaType, videoId, noteId, commentList, finished } = this.data;

      if (!finished) {
        let list;
        switch (mediaType) {
          case VIDEO:
            list = await mediaService.getVideoCommentList(videoId, ++this.page);
            break;

          case NOTE:
            list = await mediaService.getNoteCommentList(noteId, ++this.page);
            break;
        }
        list = list.map((item) => ({
          ...item,
          replies: [],
          repliesVisible: false,
        }));

        this.setData({
          commentList: init ? list : [...commentList, ...list],
        });

        if (!list.length) {
          this.setData({ finished: true });
        }
      }
    },

    async toggleRepliesVisible(e) {
      const { index } = e.currentTarget.dataset;
      if (!this.replyPageArr) this.replyPageArr = [];
      if (!this.replyPageArr[index]) this.replyPageArr[index] = 0;

      const { videoId, noteId, commentList } = this.data;
      const { id, replies, repliesCount, repliesVisible } = commentList[index];
      if (replies.length < repliesCount) {
        let list;
        switch (this.properties.mediaType) {
          case VIDEO:
            list = await mediaService.getVideoReplies(
              videoId,
              id,
              ++this.replyPageArr[index]
            );
            break;

          case NOTE:
            list = await mediaService.getNoteReplies(
              noteId,
              id,
              ++this.replyPageArr[index]
            );
            break;
        }
        if (!repliesVisible) {
          this.setData({ [`commentList[${index}].repliesVisible`]: true });
        }
        this.setData({
          [`commentList[${index}].replies`]: [...replies, ...list],
        });
      } else {
        this.setData({
          [`commentList[${index}].repliesVisible`]: !repliesVisible,
        });
      }
    },

    showInputModal() {
      this.setData({
        inputPopupVisible: true,
      });
    },

    hideInputModal() {
      this.setData({
        inputPopupVisible: false,
      });
    },

    reply(e) {
      const { commentId, nickname, index } = e.detail;
      this.setData({
        commentId,
        nickname,
        inputPopupVisible: true,
      });
      this.commentIdx = index;
      console.log(this.commentIdx)
    },

    finishComment(e) {
      const { total, curVideoIdx, commentList } = this.data;

      if (this.data.commentId) {
        const curComment = commentList[this.commentIdx];
        this.setData({
          [`commentList[${this.commentIdx}]`]: {
            ...curComment,
            repliesCount: +curComment.repliesCount,
            replies: [e.detail, ...curComment.replies],
          },
          commentId: 0,
          nickname: "",
        });
      } else {
        this.setData({
          commentList: [
            {
              ...e.detail,
              repliesCount: 0,
              replies: [],
              repliesVisible: false,
            },
            ...commentList,
          ],
        });
      }

      this.triggerEvent("update", {
        commentsNumber: ++total,
        curVideoIdx,
      });
    },

    delete(e) {
      const { commentId, index, replyIndex, isReply } = e.detail;

      wx.showModal({
        content: "确定删除该评论吗",
        showCancel: true,
        success: (result) => {
          if (result.confirm) {
            this.deleteComment(commentId, (res) => {
              const { commentList, curVideoIdx } = this.data;

              if (isReply) {
                const { replies } = commentList[index];
                replies.splice(replyIndex, 1);
                this.setData({
                  [`commentList${index}.replies`]: replies,
                });
              } else {
                commentList.splice(index, 1);
                this.setData({ commentList });
              }

              this.triggerEvent("update", {
                commentsNumber: res.data,
                curVideoIdx,
              });
            });
          }
        },
      });
    },

    deleteComment(commentId, success) {
      switch (this.properties.mediaType) {
        case VIDEO:
          mediaService.deleteVideoComment(commentId, success);
          break;

        case NOTE:
          mediaService.deleteNoteComment(commentId, success);
          break;
      }
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
