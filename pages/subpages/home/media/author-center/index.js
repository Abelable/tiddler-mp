import { checkLogin } from "../../../../../utils/index";
import MediaService from "../utils/mediaService";
import {
  SCENE_SWITCH_TAB,
  SCENE_REFRESH,
  SCENE_LOADMORE,
} from "../../../../../utils/emuns/listScene";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIndex: 0,
    navBarVisible: false,
    menuFixed: false,
    wrapHeightList: [400, 400],
    authorInfo: null,
    isFollow: false,
    videoList: [],
    videoFinished: false,
    noteList: [],
    noteFinished: false,
  },

  async onLoad({ id }) {
    this.authorId = +id;
    await this.setAuthorInfo()

    this.scrollTopArr = [0, 0];
    this.setList(SCENE_REFRESH);

    this.setNavBarVisibleLimit();
    this.setMenuFixedLimit();
  },

  onShow() {
    this.setFollowStatus()
  },

  async setAuthorInfo() {
    const authorInfo = await mediaService.getAuthorInfo(this.authorId)
    this.setData({ authorInfo })
  },

  setFollowStatus() {
    checkLogin(async () => {
      const { isFollow } = await mediaService.getFollowStatus(this.authorId);
      this.setData({ isFollow });
    });
  },

  follow() {
    mediaService.followAuthor(this.authorId, () => {
      this.setData({ isFollow: true });
    })
  },

  cancelFollow() {
    mediaService.cancelFollowAuthor(this.authorId, () => {
      this.setData({ isFollow: false });
    })
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
        duration: 0,
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
      this.setData({ videoFinished: false });
    }
    const { videoFinished, videoList } = this.data;

    if (!videoFinished) {
      const { list = [] } =
        (await mediaService.getVideoList({
          authorId: this.authorId,
          page: ++this.videoPage,
          loadingTitle: "加载中...",
        })) || {};
      this.setData({
        videoList: init ? list : [...videoList, ...list],
      });
      if (!list.length) {
        this.setData({ videoFinished: true });
      }
    }
  },

  async setNoteList(init = false) {
    if (init) {
      this.notePage = 0;
      this.setData({ noteFinished: false });
    }
    const { noteFinished, noteList } = this.data;

    if (!noteFinished) {
      const { list = [] } =
        (await mediaService.getNoteList({ 
          authorId: this.authorId,
          page: ++this.notePage,
          loadingTitle: '加载中...'
        })) || {};
      this.setData({
        noteList: init ? list : [...noteList, ...list],
      });
      if (!list.length) {
        this.setData({ noteFinished: true });
      }
    }
  },

  setNavBarVisibleLimit() {
    const query = wx.createSelectorQuery();
    query.select(".name").boundingClientRect();
    query.exec((res) => {
      this.navBarVisibleLimit = res[0].bottom;
    });
  },

  setMenuFixedLimit() {
    const query = wx.createSelectorQuery();
    query.select(".works-menu").boundingClientRect();
    query.exec((res) => {
      this.menuFixedLimit = res[0].top - statusBarHeight - 44;
    });
  },

  setWrapHeight() {
    const { curMenuIndex } = this.data;
    const query = wx.createSelectorQuery();
    query.selectAll(".content-wrap").boundingClientRect();
    query.exec((res) => {
      if (res[0][curMenuIndex]) {
        const { height } = res[0][curMenuIndex];
        this.setData({
          [`wrapHeightList[${curMenuIndex}]`]: height < 400 ? 400 : height,
        });
      }
    });
  },

  onPageScroll(e) {
    if (e.scrollTop >= this.navBarVisibleLimit) {
      !this.data.navBarVisible &&
        this.setData({
          navBarVisible: true,
        });
    } else {
      this.data.navBarVisible &&
        this.setData({
          navBarVisible: false,
        });
    }

    if (e.scrollTop >= this.menuFixedLimit) {
      !this.data.menuFixed &&
        this.setData({
          menuFixed: true,
        });
    } else {
      this.data.menuFixed &&
        this.setData({
          menuFixed: false,
        });
    }

    this.scrollTop = e.scrollTop;
  },
});
