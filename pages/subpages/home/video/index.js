import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { getQueryString } from "../../../../utils/index";
import VideoService from "./utils/videoService";

const videoService = new VideoService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    moreModalType: 1,
    videoList: [],
    commentPopupVisible: false,
    featurePopupVisible: false,
    sharePopupVisible: false,
  },

  async onLoad({ id, authorId, scene, q }) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
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
      this.setCurMediaIdx(curVideoIdx);
    }, 200);

    if (curVideoIdx > videoList.length - 5) this.setVideoList();
  },

  async setVideoList() {
    if (!this.page) this.page = 0;
    const list =
      (await videoService.getVideoList(
        ++this.page,
        this.videoId,
        this.authorId
      )) || [];
    if (list.length) {
      this.setData({
        videoList: [...this.data.videoList, ...list],
      });
    }
  },

  showCommentModal(e) {
    this.setData({
      commentModalVisible: true,
      curVideoId: e.detail.id,
      commentId: this.data.curVideoIdx == 0 ? this.commentId : "",
      secondCommentId: this.data.curVideoIdx == 0 ? this.secondCommentId : "",
    });
  },

  showMoreModal() {
    this.setData({
      moreModalVisible: true,
    });
  },

  showShareModal() {
    this.setData({
      shareModalVisible: true,
    });
  },

  async setPosterInfo() {
    const { videoList, curVideoIdx } = this.data;
    let { id, title, nickname: name } = videoList[curVideoIdx];
    const { share_data } =
      (await videoService.getShortVideoShareInfo(id)) || {};
    const { wxacode_pic, pic_url, head_img } = share_data;
    const { path: qrCode } = await videoService.getImageInfo(wxacode_pic);
    const { path: cover } = await videoService.getImageInfo(pic_url);
    const { path: avatar } = await videoService.getImageInfo(
      head_img
        ? head_img.indexOf("http") === -1
          ? `https://img.ubo.vip/${head_img}`
          : head_img
        : "https://img.ubo.vip/mp-short-video/youlian-icon.png"
    );
    this.setData({
      posterInfo: {
        cover,
        avatar,
        name,
        qrCode,
        title: title.length > 10 ? `${title.slice(0, 10)}...` : title,
      },
    });
  },

  showPosterModal() {
    this.setData({
      shareModalVisible: false,
      posterModalVisible: true,
    });
  },

  hideModal() {
    const {
      commentModalVisible,
      moreModalVisible,
      shareModalVisible,
      posterModalVisible,
    } = this.data;
    if (commentModalVisible) this.setData({ commentModalVisible: false });
    if (moreModalVisible) this.setData({ moreModalVisible: false });
    if (shareModalVisible) this.setData({ shareModalVisible: false });
    if (posterModalVisible) this.setData({ posterModalVisible: false });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
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
