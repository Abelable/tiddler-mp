import { checkLogin, getQueryString } from "../../../../../utils/index";
import {
  SCENE_MINE,
  SCENE_COLLECT,
  SCENE_LIKE
} from "../../../../../utils/emuns/mediaScene";
import NoteService from "./utils/noteService";

const noteService = new NoteService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    noteList: [],
    finished: false,
    curNoteIdx: 0,
    commentPopupVisible: false,
    inputPopupVisible: false,
    featurePopupVisible: false,
    posterInfo: null,
    posterModalVisible: false
  },

  async onLoad({ id, authorId, mediaScene, scene, q }) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    const decodedScene = scene ? decodeURIComponent(scene) : "";
    const decodedQ = q ? decodeURIComponent(q) : "";
    this.noteId =
      +id || decodedScene.split("-")[0] || getQueryString(decodedQ, "id");
    this.authorId = authorId ? +authorId : 0;
    this.mediaScene = mediaScene ? +mediaScene : 0;

    this.setNoteList(true);
  },

  onPullDownRefresh() {
    this.setNoteList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setNoteList(false);
  },

  async setNoteList(init) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    if (!this.data.finished) {
      let res;
      switch (this.mediaScene) {
        case SCENE_MINE:
          res = await noteService.getUserNoteList({
            id: this.noteId,
            page: ++this.page,
            withComments: 1
          });
          break;

        case SCENE_COLLECT:
          res = await noteService.getUserCollectNoteList(
            this.noteId,
            ++this.page
          );
          break;

        case SCENE_LIKE:
          res = await noteService.getUserLikeNoteList(this.noteId, ++this.page);
          break;

        default:
          res = await noteService.getNoteList({
            id: this.noteId,
            authorId: this.authorId,
            withComments: 1,
            page: ++this.page
          });
          break;
      }
      this.setData({
        noteList: init ? res.list : [...this.data.noteList, ...res.list]
      });
      if (!res.list.length) {
        this.setData({ finished: true });
      }
    }
  },

  showCommentPopup(e) {
    const { curNoteIdx } = e.detail;
    this.setData({
      curNoteIdx,
      commentPopupVisible: true
    });
  },

  hideCommentPopup() {
    this.setData({
      commentPopupVisible: false
    });
  },

  updateComments(e) {
    const { commentsNumber, curMediaIdx, comment } = e.detail;
    this.setData({
      [`noteList[${curMediaIdx}].commentsNumber`]: commentsNumber
    });
    if (comment) {
      this.setData({
        [`noteList[${curMediaIdx}].comments`]: [
          { nickname: comment.userInfo.nickname, content: comment.content },
          ...this.data.noteList[curMediaIdx].comments
        ]
      });
    }
  },

  deleteComment(e) {
    const { commentsNumber, curMediaIdx, commentIdx } = e.detail;
    const { comments } = this.data.noteList[curMediaIdx];
    this.setData({
      [`noteList[${curMediaIdx}].commentsNumber`]: commentsNumber
    });
    if (commentIdx !== -1) {
      comments.splice(commentIdx, 1);
      this.setData({
        [`noteList[${curMediaIdx}].comments`]: comments
      });
    }
  },

  showInputModal(e) {
    const { curNoteIdx } = e.detail;
    this.setData({
      curNoteIdx,
      inputPopupVisible: true
    });
  },

  finishComment(e) {
    const { noteList, curNoteIdx } = this.data;
    let { commentsNumber, comments } = noteList[curNoteIdx];
    this.setData({
      [`noteList[${curNoteIdx}].commentsNumber`]: ++commentsNumber,
      [`noteList[${curNoteIdx}].comments`]: [
        { nickname: e.detail.userInfo.nickname, content: e.detail.content },
        ...comments
      ],
      inputPopupVisible: false
    });
  },

  share(e) {
    checkLogin(async () => {
      const { curNoteIdx } = e.detail;
      const { noteList } = this.data;
      const { id, imageList, title, authorInfo, likeNumber } =
        noteList[curNoteIdx];

      const scene = `id=${id}`;
      const page = "pages/tab-bar-pages/home/index";
      const qrcode = await noteService.getQRCode(scene, page);

      this.setData({
        posterModalVisible: true,
        posterInfo: {
          cover: imageList[0],
          title,
          authorInfo,
          likeNumber,
          qrcode
        }
      });
    });
  },

  hideModal() {
    const { inputPopupVisible, posterModalVisible } = this.data;
    if (inputPopupVisible) {
      this.setData({
        inputPopupVisible: false
      });
    }
    if (posterModalVisible) {
      this.setData({
        posterModalVisible: false
      });
    }
  },

  showFeaturePopup(e) {
    const { curNoteIdx } = e.detail;
    this.setData({
      curNoteIdx,
      featurePopupVisible: true
    });
  },

  hideFeaturePopup() {
    this.setData({
      featurePopupVisible: false
    });
  },

  follow(e) {
    const { curNoteIdx } = e.detail;
    const { id } = this.data.noteList[curNoteIdx].authorInfo;
    noteService.followAuthor(id, () => {
      const noteList = this.data.noteList.map(item => ({
        ...item,
        isFollow: item.authorInfo.id === id
      }));
      this.setData({ noteList });
    });
  },

  like(e) {
    const { curNoteIdx } = e.detail;
    let { id, isLike, likeNumber } = this.data.noteList[curNoteIdx];
    noteService.toggleTourismNoteLikeStatus(id, () => {
      this.setData({
        [`noteList[${curNoteIdx}].isLike`]: !isLike,
        [`noteList[${curNoteIdx}].likeNumber`]: isLike
          ? --likeNumber
          : ++likeNumber
      });
    });
  },

  collect(e) {
    const { curNoteIdx } = e.detail;
    let { id, isCollected, collectionTimes } = this.data.noteList[curNoteIdx];
    noteService.toggleTourismNoteCollectStatus(id, () => {
      this.setData({
        [`noteList[${curNoteIdx}].isCollected`]: !isCollected,
        [`noteList[${curNoteIdx}].collectionTimes`]: isCollected
          ? --collectionTimes
          : ++collectionTimes
      });
    });
  },

  onShareAppMessage() {
    const { noteList, curNoteIdx } = this.data;
    const { id, title, cover: imageUrl } = noteList[curNoteIdx];
    const path = `/pages/subpages/index/short-note/index?id=${id}`;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { noteList, curNoteIdx } = this.data;
    const { id, title, cover: imageUrl } = noteList[curNoteIdx];
    const query = `id=${id}`;
    return { query, title, imageUrl };
  }
});
