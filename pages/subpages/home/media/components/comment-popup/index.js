import { VIDEO, NOTE } from "../../../../utils/emuns/mediaType";
import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    mediaType: Number,
    curMediaIdx: Number,
    mediaId: Number,
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

      const { mediaType, mediaId, commentList, finished } = this.data;

      if (!finished) {
        let list;
        switch (mediaType) {
          case VIDEO:
            list = await mediaService.getVideoCommentList(mediaId, ++this.page);
            break;

          case NOTE:
            list = await mediaService.getNoteCommentList(mediaId, ++this.page);
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

      const { mediaId, commentList } = this.data;
      const { id, replies, repliesCount, repliesVisible } = commentList[index];
      if (replies.length < repliesCount) {
        let list;
        switch (this.properties.mediaType) {
          case VIDEO:
            list = await mediaService.getVideoReplies(
              mediaId,
              id,
              ++this.replyPageArr[index]
            );
            break;

          case NOTE:
            list = await mediaService.getNoteReplies(
              mediaId,
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
    },

    finishComment(e) {
      const { total, curMediaIdx, commentList } = this.data;

      if (this.data.commentId) {
        const curComment = commentList[this.commentIdx];
        this.setData({
          [`commentList[${this.commentIdx}]`]: {
            ...curComment,
            repliesCount: curComment.repliesCount + 1,
            replies: [e.detail, ...curComment.replies],
          },
          commentId: 0,
          nickname: "",
          inputPopupVisible: false,
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
          inputPopupVisible: false,
        });
      }

      this.triggerEvent("update", {
        commentsNumber: total + 1,
        curMediaIdx,
        comment: !this.data.commentId ? e.detail : null,
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
              const { commentList, curMediaIdx } = this.data;

              if (isReply) {
                const { replies, repliesCount } = commentList[index];
                replies.splice(replyIndex, 1);
                this.setData({
                  [`commentList[${index}].replies`]: replies,
                  [`commentList[${index}].repliesCount`]: repliesCount - 1,
                });
              } else {
                commentList.splice(index, 1);
                this.setData({ commentList });
              }

              this.triggerEvent("delete", {
                commentsNumber: res.data,
                curMediaIdx,
                commentIdx: !isReply && index < 8 ? index : -1,
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
