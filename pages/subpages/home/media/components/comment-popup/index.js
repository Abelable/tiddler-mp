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
      this.setCommentList(true)
    },

    loadMore() {
      this.setCommentList()
    },

    async setCommentList(init = false) {
      if (init) {
        this.setData({ finished: false });
        this.page = 0;
      }

      const { mediaType, videoId, noteId, commentList, finished } = this.data;

      if (!finished) {
        let list
        switch (mediaType) {
          case VIDEO:
            list = await mediaService.getVideoCommentList(videoId, ++this.page)
            break;
  
          case NOTE:
            list = await mediaService.getNoteCommentList(noteId, ++this.page)
            break;
        }
         list = list.map((item) => ({
          ...item,
          replies: [],
          repliesVisible: false,
        }));

        this.setData({
          commentList: init
            ? list
            : [...commentList, ...list],
        });

        console.log(this.data.commentList)

        if (!list.length) {
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
