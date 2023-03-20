import { getQueryString } from "../../../../utils/index";
import VideoService from "./utils/videoService";

const videoService = new VideoService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    moreModalType: 1,
    videoList: [],
    curVideoIdx: 0,
    commentPopupVisible: false,
    featurePopupVisible: false,
    sharePopupVisible: false,
  },

  async onLoad({ id, authorId, scene, q }) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });

    const decodedScene = scene ? decodeURIComponent(scene) : "";
    const decodedQ = q ? decodeURIComponent(q) : "";
    this.videoId =
      id || decodedScene.split("-")[0] || getQueryString(decodedQ, "id");
    this.authorId = authorId || 0;

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
    if (!this.page) this.page = 0;
    const { list = [] } =
      (await videoService.getVideoList(
        ++this.page,
        this.videoId,
        this.authorId
      )) || {};
    this.setData({
      videoList: [...this.data.videoList, ...list],
    });
  },

  showCommentPopup() {
    this.setData({
      commentPopupVisible: true,
    });
  },

  showFeaturePopup() {
    this.setData({
      featurePopupVisible: true,
    });
  },

  showShareModal() {
    this.setData({
      sharePopupVisible: true,
    });
  },

  onShareAppMessage() {
    const { videoList, curVideoIdx, userInfo } = this.data;
    let { id, title, cover_url: imageUrl } = videoList[curVideoIdx];
    const path = `/pages/subpages/index/short-video/index?id=${id}&shopid=${wx.getStorageSync(
      "myShopid"
    )}&inviteid=${userInfo.userID}`;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { videoList, curVideoIdx, userInfo } = this.data;
    let { id, title, cover_url: imageUrl } = videoList[curVideoIdx];
    title = `海豹视频：${title}`;
    const query = `id=${id}&shopid=${wx.getStorageSync("myShopid")}&inviteid=${
      userInfo.userID
    }`;
    return { query, title, imageUrl };
  },
});
