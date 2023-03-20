import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../store/index";
import BaseService from "../../services/baseService";

const baseService = new BaseService();

Component({
  options: {
    addGlobalClass: true
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
    commentsList: [],
    replyCommentId: 0,
    replyUserName: "",
    showNomore: false,
    inputModalVisible: false,
  },

  lifetimes: {
    attached() {
      this.commentListService = this.properties.videoId
        ? baseService.getVideoCommentList
        : baseService.getNoteCommentList;
      
      this.replyCommentListService = this.properties.videoId
      ? baseService.getVideoReplyCommentList
      : baseService.getNoteReplyCommentList;
    },
  },

  methods: {
    initData() {
      this.setData({
        commentsList: [],
        replyCommentId: 0,
        showNomore: false,
      });
    },

    async setCommentsList(init = false) {
      // const initTruthy = (typeof(init) === 'boolean' && init)
      // if (initTruthy) {
      //   this.page = 0
      //   this.replyPageArr = []
      //   this.setData({ commentsList: [] })
      // }
      // const { videoId, curCommentId, curSecCommentId } = this.properties
      // const { comment_count: totalCount, list: commentsList = [] } = await baseService.getCommentsLists({ videoId, commentId: initTruthy ? curCommentId : '', secCommentId: initTruthy ? curSecCommentId : '', page: ++this.page }) || {}
      // if (initTruthy) this.setData({ totalCount })
      // if (commentsList.length) {
      //   commentsList.map(item => {
      //     item.replyFold = true
      //     item.replyLists = []
      //   })
      //   this.setData({
      //     commentsList: initTruthy ? commentsList : [...this.data.commentsList, ...commentsList]
      //   })
      //   if (initTruthy && curSecCommentId) this.toggleSpread(0)
      // } else {
      //   !initTruthy && this.setData({ showNomore: true })
      // }
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
      } = this.data.commentsList[index];
      if (replayCount > replyLists.length) {
        const { list } = await baseService.getSecondCommentsLists({
          parentId,
          page: ++this.replyPageArr[index],
        });
        if (replyFold)
          this.setData({ [`commentsList[${index}].replyFold`]: false });
        this.setData({
          [`commentsList[${index}].replyLists`]: [...replyLists, ...list],
        });
      }
      if (replayCount == replyLists.length) {
        this.setData({ [`commentsList[${index}].replyFold`]: !replyFold });
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
