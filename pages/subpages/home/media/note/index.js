import { getQueryString } from "../../../../../utils/index";
import { SCENE_MINE, SCENE_COLLECT, SCENE_LIKE } from '../../../../../utils/emuns/mediaScene'
import NoteService from "./utils/noteService";

const noteService = new NoteService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    noteList: [],
    finished: false,
    commentPopupVisible: false,
    inputPopupVisible: false,
    featurePopupVisible: false,
    sharePopupVisible: false,
  },

  async onLoad({ id, authorId, mediaScene, scene, q }) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });

    const decodedScene = scene ? decodeURIComponent(scene) : "";
    const decodedQ = q ? decodeURIComponent(q) : "";
    this.noteId =
      +id || decodedScene.split("-")[0] || getQueryString(decodedQ, "id");
    this.authorId = authorId ? +authorId : 0;
    this.mediaScene = +mediaScene

    await this.setNoteList(true);
  },

  async setNoteList(init) {
    if (init) {
      this.page = 0
      this.setData({ finished: false })
    }
    if (!this.data.finished) {
      let res
      switch (this.mediaScene) {
        case SCENE_MINE:
          res = await noteService.getUserNoteList({ id: this.noteId, page: ++this.page })
          break;

        case SCENE_COLLECT:
          res = await noteService.getUserCollectNoteList(this.noteId, ++this.page)
          break;

        case SCENE_LIKE:
          res = await noteService.getUserLikeNoteList(this.noteId, ++this.page)
          break;
      
        default:
          res = await noteService.getNoteList(
            ++this.page,
            this.noteId,
            this.authorId
          )
          break;
      }
      this.setData({
        noteList: [...this.data.noteList, ...res.list],
      });
      if (!res.list.length) {
        this.setData({ finished: true })
      }
    }
  },

  showCommentPopup() {
    this.setData({
      commentPopupVisible: true,
    });
  },

  hideCommentPopup() {
    this.setData({
      commentPopupVisible: false,
    });
  },

  reply(e) {
    const { commentId, nickname } = e.detail;
    this.setData({
      commentId,
      nickname,
      inputPopupVisible: true,
    });
  },

  updateCommentsNumber(e) {
    const { commentsNumber, curNoteIdx } = e.detail;
    this.setData({
      [`noteList[${curNoteIdx}].commentsNumber`]: commentsNumber,
    });
  },

  showInputModal() {
    this.setData({
      inputPopupVisible: true,
    });
  },

  finishComment() {
    const { noteList, curNoteIdx } = this.data
    this.setData({
      [`noteList[${curNoteIdx}].commentsNumber`]: ++noteList[curNoteIdx].commentsNumber,
      inputPopupVisible: false
    })
  },

  hideInputModal() {
    this.setData({
      inputPopupVisible: false
    });
  },

  showSharePopup() {
    this.setData({
      sharePopupVisible: true,
    });
  },

  hideSharePopup() {
    this.setData({
      sharePopupVisible: true,
    });
  },

  showFeaturePopup() {
    this.setData({
      featurePopupVisible: true,
    });
  },

  hideFeaturePopup() {
    this.setData({
      featurePopupVisible: false,
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
  },
});
