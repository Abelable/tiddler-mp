import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../store/index";
import { checkLogin, numOver } from "../../../../../utils/index";
import NoteService from "./utils/noteService";

const noteService = new NoteService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    noteInfo: null,
    commentList: [],
    finished: false,
    curPositonIdx: 0,
    commentId: 0,
    inputPopupVisible: false,
    featurePopupVisible: false,
    posterInfo: null,
    posterModalVisible: false
  },

  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"]
    });

    const { id, scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.noteId = +id || decodedSceneList[0];
    this.superiorId = decodedSceneList[1] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await noteService.getUserInfo(this.superiorId);
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    this.setNoteInfo();
    this.setCommentList(true);
  },

  onPullDownRefresh() {
    this.setCommentList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setCommentList();
  },

  async setNoteInfo() {
    const noteInfo = await noteService.getNoteInfo(this.noteId);
    this.setData({ noteInfo });
  },

  async setCommentList(init = false) {
    if (init) {
      this.setData({ finished: false });
      this.page = 0;
      this.limit = 10;
    }

    const { commentList } = this.data;

    const list = (
      await noteService.getNoteCommentList(this.noteId, ++this.page, this.limit)
    ).map(item => ({
      ...item,
      replies: [],
      repliesVisible: false
    }));

    this.setData({
      commentList: init ? list : [...commentList, ...list]
    });

    if (list.length < this.limit) {
      this.setData({ finished: true });
    }
  },

  async toggleRepliesVisible(e) {
    const { index } = e.detail;
    if (!this.replyPageArr) this.replyPageArr = [];
    if (!this.replyPageArr[index]) this.replyPageArr[index] = 0;

    const { noteInfo, commentList } = this.data;
    const { id, replies, repliesCount, repliesVisible } = commentList[index];
    if (replies.length < repliesCount) {
      const list = await noteService.getNoteReplies(
        noteInfo.id,
        id,
        ++this.replyPageArr[index]
      );
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

  delete(e) {
    const { commentId, index, replyIndex, isReply } = e.detail;
    noteService.deleteNoteComment(commentId, res => {
      const { commentList } = this.data;

      if (isReply) {
        const { replies, repliesCount } = commentList[index];
        replies.splice(replyIndex, 1);
        this.setData({
          [`commentList[${index}].replies`]: replies,
          [`commentList[${index}].repliesCount`]: repliesCount - 1,
          ["noteInfo.commentsNumber"]: res.data
        });
      } else {
        commentList.splice(index, 1);
        this.setData({ commentList, ["noteInfo.commentsNumber"]: res.data });
      }
    });
  },

  finishComment(e) {
    const { commentId, noteInfo, commentList } = this.data;
    const { commentsNumber } = noteInfo;

    if (commentId) {
      const curComment = commentList[this.commentIdx];
      this.setData({
        [`commentList[${this.commentIdx}]`]: {
          ...curComment,
          repliesCount: curComment.repliesCount + 1,
          replies: [e.detail, ...curComment.replies]
        },
        commentId: 0,
        nickname: "",
        ["noteInfo.commentsNumber"]: commentsNumber + 1,
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
        ["noteInfo.commentsNumber"]: commentsNumber + 1,
        inputPopupVisible: false
      });
    }
  },

  follow() {
    const { id } = this.data.noteInfo.authorInfo;
    noteService.followAuthor(id, () => {
      this.setData({
        ["noteInfo.isFollow"]: true
      });
    });
  },

  like() {
    const { id, isLike, likeNumber } = this.data.noteInfo;
    noteService.toggleTourismNoteLikeStatus(id, () => {
      this.setData({
        [`noteInfo.isLike`]: !isLike,
        [`noteInfo.likeNumber`]: isLike ? likeNumber - 1 : likeNumber + 1
      });
    });
  },

  collect() {
    const { id, isCollected, collectionTimes } = this.data.noteInfo;
    noteService.toggleTourismNoteCollectStatus(id, () => {
      this.setData({
        [`noteInfo.isCollected`]: !isCollected,
        [`noteInfo.collectionTimes`]: isCollected
          ? collectionTimes - 1
          : collectionTimes + 1
      });
    });
  },

  previewImage(e) {
    const { current } = e.currentTarget.dataset;
    const urls = this.data.noteInfo.imageList;
    wx.previewImage({ current, urls });
  },

  showInputModal() {
    this.setData({
      inputPopupVisible: true
    });
  },

  showFeaturePopup() {
    this.setData({
      featurePopupVisible: true
    });
  },

  hideFeaturePopup() {
    this.setData({
      featurePopupVisible: false
    });
  },

  hideModal() {
    const { inputPopupVisible, posterModalVisible } = this.data;
    if (inputPopupVisible) {
      this.setData({
        commentId: 0,
        nickname: "",
        inputPopupVisible: false
      });
    }
    if (posterModalVisible) {
      this.setData({
        posterModalVisible: false
      });
    }
  },

  navToAuthorCenter() {
    const { id } = this.data.noteInfo.authorInfo;
    if (store.userInfo.id !== id) {
      wx.navigateTo({
        url: `/pages/subpages/home/media/author-center/index?id=${id}`
      });
    }
  },

  share() {
    checkLogin(async () => {
      const { id, imageList, title, content, authorInfo, likeNumber } =
        this.data.noteInfo;
      const scene = store.superiorInfo
        ? `${id}-${store.superiorInfo.id}`
        : `${id}`;
      const page = "pages/subpages/home/media/note/index";

      noteService.shareTourismNote(id, scene, page, res => {
        const { qrCode, shareTimes } = res.data;
        this.setData({
          posterModalVisible: true,
          posterInfo: {
            cover: imageList[0],
            title,
            content,
            authorInfo,
            likeNumber: numOver(likeNumber, 100000),
            qrCode
          },
          [`noteInfo.shareTimes`]: shareTimes
        });
      });
    });
  },

  onShareAppMessage() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, title, cover: imageUrl } = this.data.noteInfo;
    const path = superiorId
      ? `/pages/subpages/home/media/note/index?id=${id}&superiorId=${superiorId}`
      : `/pages/subpages/home/media/note/index?id=${id}`;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, title, cover: imageUrl } = this.data.noteInfo;
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title, imageUrl };
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
