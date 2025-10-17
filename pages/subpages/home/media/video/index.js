import { numOver } from "../../../../../utils/index";
import { store } from "../../../../../store/index";
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

  async onLoad(options) {
    const { id, authorId, mediaScene, scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.videoId = +id || decodedSceneList[0];
    this.superiorId = decodedSceneList[1] || "";
    this.authorId = authorId ? +authorId : 0;
    this.mediaScene = mediaScene ? +mediaScene : 0;

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await videoService.getUserInfo(this.superiorId);
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    this.setVideoList();

    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
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
    const scene =
      wx.getStorageSync("token") && store.superiorInfo
        ? `${id}-${store.superiorInfo.id}`
        : `${id}`;
    const page = "pages/subpages/home/media/video/index";

    videoService.shareShortVideo(id, scene, page, res => {
      const { qrCode, shareTimes } = res.data;
      this.setData({
        posterModalVisible: true,
        posterInfo: {
          cover,
          title,
          authorInfo,
          likeNumber: numOver(likeNumber, 100000),
          qrCode
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
    const { id: superiorId } = store.superiorInfo || {};
    const { videoList, curVideoIdx } = this.data;
    const { id, title, cover: imageUrl } = videoList[curVideoIdx];
    const originalPath = `/pages/subpages/home/media/video/index?id=${id}`;
    const path = superiorId
      ? `${originalPath}&superiorId=${superiorId}`
      : originalPath;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { id: superiorId } = store.superiorInfo || {};
    const { videoList, curVideoIdx } = this.data;
    const { id, title, cover: imageUrl } = videoList[curVideoIdx];
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title, imageUrl };
  }
});
