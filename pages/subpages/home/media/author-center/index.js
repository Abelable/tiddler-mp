import { checkLogin, numOver } from "../../../../../utils/index";
import { store } from "../../../../../store/index";
import MediaService from "../../utils/mediaService";
import {
  SCENE_INIT,
  SCENE_SWITCH_TAB,
  SCENE_REFRESH,
  SCENE_LOADMORE
} from "../../../../../utils/emuns/listScene";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarVisible: false,
    menuFixed: false,
    curMenuIndex: 0,
    wrapHeightList: [550, 550],
    authorInfo: null,
    isFollow: false,
    videoList: [],
    videoLoading: false,
    videoFinished: false,
    noteList: [],
    noteLoading: false,
    noteFinished: false,
    posterInfo: null,
    posterModalVisible: false
  },

  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    const { id, superiorId = "", scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.authorId = +id || decodedSceneList[0];
    this.superiorId = superiorId || decodedSceneList[1] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await mediaService.getUserInfo(this.superiorId);
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    await this.setAuthorInfo();

    this.scrollTopArr = [0, 0];
    this.setList(SCENE_INIT);

    this.setNavBarVisibleLimit();
    this.setMenuFixedLimit();
  },

  onShow() {
    this.setFollowStatus();
  },

  async setAuthorInfo() {
    const authorInfo = await mediaService.getAuthorInfo(this.authorId);
    this.setData({ authorInfo });
  },

  setFollowStatus() {
    checkLogin(async () => {
      const { isFollow } = await mediaService.getFollowStatus(this.authorId);
      this.setData({ isFollow });
    }, false);
  },

  follow() {
    mediaService.followAuthor(this.authorId, () => {
      this.setData({ isFollow: true });
    });
  },

  cancelFollow() {
    mediaService.cancelFollowAuthor(this.authorId, () => {
      this.setData({ isFollow: false });
    });
  },

  switchMenu(e) {
    this.handleMenuChange(Number(e.currentTarget.dataset.index));
  },

  swiperChange(e) {
    this.handleMenuChange(Number(e.detail.current));
  },

  handleMenuChange(index) {
    const { curMenuIndex } = this.data;
    if (curMenuIndex !== index) {
      this.setData({ curMenuIndex: index }, () => {
        this.setList(SCENE_SWITCH_TAB);
      });
      this.scrollTopArr[curMenuIndex] = this.scrollTop || 0;
      wx.pageScrollTo({
        scrollTop: this.scrollTopArr[index] || 0,
        duration: 0
      });
    }
  },

  onPullDownRefresh() {
    this.setList(SCENE_REFRESH);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setList(SCENE_LOADMORE);
  },

  setList(scene) {
    const { curMenuIndex, videoList, noteList } = this.data;
    switch (scene) {
      case SCENE_INIT:
        this.setVideoList(true);
        this.setNoteList(true);
        break;

      case SCENE_SWITCH_TAB:
        switch (curMenuIndex) {
          case 0:
            if (!videoList.length) this.setVideoList(true);
            break;

          case 1:
            if (!noteList.length) this.setNoteList(true);
            break;
        }
        break;

      case SCENE_REFRESH:
        switch (curMenuIndex) {
          case 0:
            this.setVideoList(true);
            break;

          case 1:
            this.setNoteList(true);
            break;
        }
        break;

      case SCENE_LOADMORE:
        switch (curMenuIndex) {
          case 0:
            this.setVideoList();
            break;

          case 1:
            this.setNoteList();
            break;
        }
        break;
    }
  },

  async setVideoList(init = false) {
    if (init) {
      this.videoPage = 0;
      this.setData({ videoList: [], videoFinished: false });
    }
    const { videoList } = this.data;

    this.setData({ videoLoading: true });
    const { list = [] } =
      (await mediaService.getVideoList({
        authorId: this.authorId,
        page: ++this.videoPage
      })) || {};
    this.setData({
      videoList: init ? list : [...videoList, ...list],
      videoLoading: false
    });
    if (!list.length) {
      this.setData({ videoFinished: true });
    }
  },

  async setNoteList(init = false) {
    if (init) {
      this.notePage = 0;
      this.setData({ noteList: [], noteFinished: false });
    }
    const { noteList } = this.data;

    this.setData({ noteLoading: true });
    const { list = [] } =
      (await mediaService.getNoteList({
        authorId: this.authorId,
        page: ++this.notePage,
        loadingTitle: "正在加载"
      })) || {};
    this.setData({
      noteList: init ? list : [...noteList, ...list],
      noteLoading: false
    });
    if (!list.length) {
      this.setData({ noteFinished: true });
    }
  },

  setNavBarVisibleLimit() {
    const query = wx.createSelectorQuery();
    query.select(".name").boundingClientRect();
    query.exec(res => {
      this.navBarVisibleLimit = res[0].bottom;
    });
  },

  setMenuFixedLimit() {
    const query = wx.createSelectorQuery();
    query.select(".works-menu").boundingClientRect();
    query.exec(res => {
      this.menuFixedLimit = res[0].top - statusBarHeight - 44;
    });
  },

  setWrapHeight() {
    const { curMenuIndex } = this.data;
    const query = wx.createSelectorQuery();
    query.selectAll(".content-wrap").boundingClientRect();
    query.exec(res => {
      if (res[0][curMenuIndex]) {
        const { height } = res[0][curMenuIndex];
        this.setData({
          [`wrapHeightList[${curMenuIndex}]`]: height < 550 ? 550 : height
        });
      }
    });
  },

  onPageScroll(e) {
    if (e.scrollTop >= this.navBarVisibleLimit) {
      !this.data.navBarVisible &&
        this.setData({
          navBarVisible: true
        });
    } else {
      this.data.navBarVisible &&
        this.setData({
          navBarVisible: false
        });
    }

    if (e.scrollTop >= this.menuFixedLimit) {
      !this.data.menuFixed &&
        this.setData({
          menuFixed: true
        });
    } else {
      this.data.menuFixed &&
        this.setData({
          menuFixed: false
        });
    }

    this.scrollTop = e.scrollTop;
  },

  chat() {
    const { id, avatar, nickname } = this.data.authorInfo;
    const url = `/pages/subpages/notice/chat/index?userId=${id}&name=${nickname}&avatar=${avatar}`;
    wx.navigateTo({ url });
  },

  share() {
    checkLogin(async () => {
      const { authorInfo, videoList, noteList } = this.data;
      const {
        id,
        bg,
        avatar,
        nickname,
        beLikedTimes,
        followedAuthorNumber,
        fansNumber
      } = authorInfo;

      const scene = store.superiorInfo
        ? `${id}-${store.superiorInfo.id}`
        : `${id}`;
      const page = "pages/subpages/home/media/author-center/index";
      const qrCode = await mediaService.getQrCode(scene, page);

      this.setData({
        posterModalVisible: true,
        posterInfo: {
          cover: bg ? bg : "https://static.tiddler.cn/mp/bg.png",
          authorInfo: { avatar, nickname },
          auchorDataDesc: `${numOver(beLikedTimes, 100000)}获赞｜${numOver(
            followedAuthorNumber,
            100000
          )}关注｜${numOver(fansNumber, 100000)}粉丝`,
          imageList: [
            ...videoList.map(item => item.cover),
            ...noteList.map(item => item.imageList[0])
          ].slice(0, 6),
          qrCode
        }
      });
    });
  },

  hidePosterModal() {
    this.setData({ posterModalVisible: false });
  },

  checkAvatar() {
    const { avatar } = this.data.authorInfo;
    wx.previewImage({
      current: avatar,
      urls: [avatar]
    });
  },

  onShareAppMessage() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, nickname: title } = this.data.authorInfo;
    const originalPath = `/pages/subpages/home/media/author-center/index?id=${id}`;
    const path = superiorId
      ? `${originalPath}&superiorId=${superiorId}`
      : originalPath;
    return { path, title };
  },

  onShareTimeline() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, nickname: title } = this.data.authorInfo;
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title };
  }
});
