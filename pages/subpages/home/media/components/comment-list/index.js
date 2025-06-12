import { VIDEO, NOTE } from "../../../../utils/emuns/mediaType";
import MediaService from "../../../utils/mediaService";

const mediaService = new MediaService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    commentList: Array,
    mediaType: Number,
    authorId: Number,
    total: Number
  },

  data: {
    commentId: 0,
    nickname: "",
  },

  methods: {
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
          [`commentList[${index}].replies`]: [...replies, ...list]
        });
      } else {
        this.setData({
          [`commentList[${index}].repliesVisible`]: !repliesVisible
        });
      }
    },

    reply(e) {
      const { commentId, nickname, index } = e.detail;
      this.setData({
        commentId,
        nickname,
        inputPopupVisible: true
      });
      this.commentIdx = index;
    },

    finishComment(e) {
      const { total, commentList } = this.data;

      if (this.data.commentId) {
        const curComment = commentList[this.commentIdx];
        this.setData({
          [`commentList[${this.commentIdx}]`]: {
            ...curComment,
            repliesCount: curComment.repliesCount + 1,
            replies: [e.detail, ...curComment.replies]
          },
          commentId: 0,
          nickname: "",
          inputPopupVisible: false
        });
      } else {
        this.setData({
          commentList: [
            {
              ...e.detail,
              repliesCount: 0,
              replies: [],
              repliesVisible: false
            },
            ...commentList
          ],
          inputPopupVisible: false
        });
      }

      this.triggerEvent("update", { commentsNumber: total + 1 });
    },

    delete(e) {
      const { commentId, index, replyIndex, isReply } = e.detail;

      wx.showModal({
        content: "确定删除该评论吗",
        showCancel: true,
        success: result => {
          if (result.confirm) {
            this.deleteComment(commentId, res => {
              const { commentList } = this.data;

              if (isReply) {
                const { replies, repliesCount } = commentList[index];
                replies.splice(replyIndex, 1);
                this.setData({
                  [`commentList[${index}].replies`]: replies,
                  [`commentList[${index}].repliesCount`]: repliesCount - 1
                });
              } else {
                commentList.splice(index, 1);
                this.setData({ commentList });
              }

              this.triggerEvent("delete", { commentsNumber: res.data });
            });
          }
        }
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
  }
});
