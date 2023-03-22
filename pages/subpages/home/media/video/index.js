import { getQueryString } from "../../../../../utils/index";
import { SCENE_MINE, SCENE_COLLECT, SCENE_LIKE } from '../../../../../utils/emuns/mediaScene'
import VideoService from "./utils/videoService";

const videoService = new VideoService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    videoList: [],
    curVideoIdx: 0,
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
    this.videoId =
      +id || decodedScene.split("-")[0] || getQueryString(decodedQ, "id");
    this.authorId = authorId ? +authorId : 0;
    this.mediaScene = +mediaScene

    await this.setVideoList();
  },

  changeVideo(e) {
    const curVideoIdx = Number(e.detail.current);
    const { videoList } = this.data;

    this.setCurMediaIdxTimeout && clearTimeout(this.setCurMediaIdxTimeout);
    this.setCurMediaIdxTimeout = setTimeout(async () => {
      this.setData({ curVideoIdx });
    }, 200);

    if (curVideoIdx > videoList.length - 5) this.setVideoList();
  },

  async setVideoList() {
    if (!this.finished) {
      if (!this.page) this.page = 0;
      let res

      switch (this.mediaScene) {
        case SCENE_MINE:
          res = await videoService.getUserVideoList({ id: this.videoId, page: ++this.page })
          break;

        case SCENE_COLLECT:
          res = await videoService.getUserCollectVideoList(this.videoId, ++this.page)
          break;

        case SCENE_LIKE:
          res = await videoService.getUserLikeVideoList(this.videoId, ++this.page)
          break;
      
        default:
          res = await videoService.getVideoList(
            ++this.page,
            this.videoId,
            this.authorId
          )
          break;
      }
      this.setData({
        videoList: [...this.data.videoList, ...res.list],
      });
      if (!res.list.length) {
        this.finished = true
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

  updateCommentsNumber(e) {
    const { commentsNumber, curVideoIdx } = e.detail;
    this.setData({
      [`videoList[${curVideoIdx}].commentsNumber`]: commentsNumber,
    });
  },

  showInputModal() {
    this.setData({
      inputPopupVisible: true,
    });
  },

  finishComment() {
    const { videoList, curVideoIdx } = this.data
    this.setData({
      [`videoList[${curVideoIdx}].commentsNumber`]: ++videoList[curVideoIdx].commentsNumber,
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
    const { videoList, curVideoIdx } = this.data;
    const { id, title, cover: imageUrl } = videoList[curVideoIdx];
    const path = `/pages/subpages/index/short-video/index?id=${id}`;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { videoList, curVideoIdx } = this.data;
    const { id, title, cover: imageUrl } = videoList[curVideoIdx];
    const query = `id=${id}`;
    return { query, title, imageUrl };
  },
});
