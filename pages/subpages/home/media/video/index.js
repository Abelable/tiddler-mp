import { getQueryString, numOver } from "../../../../../utils/index";
import {
  SCENE_MINE,
  SCENE_COLLECT,
  SCENE_LIKE
} from "../../../../../utils/emuns/mediaScene";
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
    this.videoId =
      +id || decodedScene.split("-")[0] || getQueryString(decodedQ, "id");
    this.authorId = authorId ? +authorId : 0;
    this.mediaScene = mediaScene ? +mediaScene : 0;

    this.setVideoList();
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
      let res;

      switch (this.mediaScene) {
        case SCENE_MINE:
          res = await videoService.getUserVideoList({
            id: this.videoId,
            page: ++this.page
          });
          break;

        case SCENE_COLLECT:
          res = await videoService.getUserCollectVideoList(
            this.videoId,
            ++this.page
          );
          break;

        case SCENE_LIKE:
          res = await videoService.getUserLikeVideoList(
            this.videoId,
            ++this.page
          );
          break;

        default:
          res = await videoService.getVideoList({
            id: this.videoId,
            authorId: this.authorId,
            page: ++this.page
          });
          break;
      }
      this.setData({
        videoList: [...this.data.videoList, ...res.list]
      });
      if (!res.list.length) {
        this.finished = true;
      }
    }
  },

  follow() {
    const { videoList, curVideoIdx } = this.data;
    const { id } = videoList[curVideoIdx].authorInfo;
    videoService.followAuthor(id, () => {
      const list = videoList.map(item => ({
        ...item,
        isFollow: item.authorInfo.id === id
      }));
      this.setData({ videoList: list });
    });
  },

  like() {
    const { videoList, curVideoIdx } = this.data;
    let { id, isLike, likeNumber } = videoList[curVideoIdx];
    videoService.toggleShortVideoLikeStatus(id, () => {
      this.setData({
        [`videoList[${curVideoIdx}].isLike`]: !isLike,
        [`videoList[${curVideoIdx}].likeNumber`]: isLike
          ? --likeNumber
          : ++likeNumber
      });
    });
  },

  collect() {
    const { videoList, curVideoIdx } = this.data;
    let { id, isCollected, collectionTimes } = videoList[curVideoIdx];
    videoService.toggleShortVideoCollectStatus(id, () => {
      this.setData({
        [`videoList[${curVideoIdx}].isCollected`]: !isCollected,
        [`videoList[${curVideoIdx}].collectionTimes`]: isCollected
          ? --collectionTimes
          : ++collectionTimes
      });
    });
  },

  showCommentPopup() {
    this.setData({
      commentPopupVisible: true
    });
  },

  hideCommentPopup() {
    this.setData({
      commentPopupVisible: false
    });
  },

  updateCommentsNumber(e) {
    const { commentsNumber, curMediaIdx } = e.detail;
    this.setData({
      [`videoList[${curMediaIdx}].commentsNumber`]: commentsNumber
    });
  },

  showInputModal() {
    this.setData({
      inputPopupVisible: true
    });
  },

  finishComment() {
    const { videoList, curVideoIdx } = this.data;
    this.setData({
      [`videoList[${curVideoIdx}].commentsNumber`]: ++videoList[curVideoIdx]
        .commentsNumber,
      inputPopupVisible: false
    });
  },

  async share() {
    const { videoList, curVideoIdx } = this.data;
    const { id, cover, title, authorInfo, likeNumber } = videoList[curVideoIdx];
    const scene = `id=${id}`;
    const page = "pages/tab-bar-pages/home/index";

    videoService.shareShortVideo(id, scene, page, res => {
      const { qrcode, shareTimes } = res.data;
      this.setData({
        posterModalVisible: true,
        posterInfo: {
          cover,
          title,
          authorInfo,
          likeNumber: numOver(likeNumber, 100000),
          qrcode
        },
        [`videoList[${curVideoIdx}].shareTimes`]: shareTimes
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
  }
});
