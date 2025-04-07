import { checkLogin, numOver } from "../../../../../utils/index";
import { store } from "../../../../../store/index";
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

  async onLoad(options) {
    const {
      id,
      authorId,
      mediaScene,
      superiorId = "",
      scene = ""
    } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.noteId = +id || decodedSceneList[0];
    this.superiorId = +superiorId || decodedSceneList[1];
    this.authorId = authorId ? +authorId : 0;
    this.mediaScene = mediaScene ? +mediaScene : 0;

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.promoterInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await noteService.getSuperiorInfo(this.superiorId);
        store.setPromoterInfo(superiorInfo);
      }
    });

    this.setNoteList(true);

    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
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
      const { id, imageList, title, content, authorInfo, likeNumber } =
        noteList[curNoteIdx];
      const scene = store.promoterInfo
        ? `${id}-${store.promoterInfo.id}`
        : `${id}`;
      const page = "pages/subpages/home/media/note/index";

      noteService.shareTourismNote(id, scene, page, res => {
        const { qrcode, shareTimes } = res.data;
        this.setData({
          posterModalVisible: true,
          posterInfo: {
            cover: imageList[0],
            title,
            content,
            authorInfo,
            likeNumber: numOver(likeNumber, 100000),
            qrcode
          },
          [`noteList[${curNoteIdx}].shareTimes`]: shareTimes
        });
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
    const path = store.promoterInfo
      ? `/pages/subpages/home/media/note/index?id=${id}&superiorId=${store.promoterInfo.id}`
      : `/pages/subpages/home/media/note/index?id=${id}`;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { noteList, curNoteIdx } = this.data;
    const { id, title, cover: imageUrl } = noteList[curNoteIdx];
    const query = store.promoterInfo
    ? `id=${id}&superiorId=${promoterInfo.id}`
    : `id=${id}`;
    return { query, title, imageUrl };
  }
});
