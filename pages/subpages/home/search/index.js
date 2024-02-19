import { customBack } from "../../../../utils/index";
import MediaService from "../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    historyKeywords: [],
    keywords: "",
    isSearching: false,
    curMenuIdx: 0,
    videoList: [],
    videoFinished: false,
    noteList: [],
    noteFinished: false,
    liveList: [],
    liveFinished: false,
  },

  onLoad() {
    this.setHistoryKeywords();
  },

  setKeywords(e) {
    this.setData({
      keywords: e.detail.value,
    });
  },

  cancelSearch() {
    this.setHistoryKeywords();
    this.setData({
      keywords: "",
      isSearching: false,
      videoList: [],
      videoFinished: false,
      noteList: [],
      noteFinished: false,
      liveList: [],
      liveFinished: false,
    });
  },

  selectKeywords(e) {
    const { keywords } = e.currentTarget.dataset;
    this.setData({
      keywords,
      isSearching: true,
    });
    switch (this.data.curMenuIdx) {
      case 0:
        this.setVideoList(true);
        break;

      case 1:
        this.setNoteList(true);
        break;

      case 2:
        this.setLiveList(true);
        break;
    }
  },

  search() {
    const { keywords, isSearching, historyKeywords } = this.data;
    if (!keywords) {
      return;
    }
    this.setData({
      historyKeywords: Array.from(new Set([...historyKeywords, keywords])),
    });
    if (!isSearching) {
      this.setData({ isSearching: true });
    }
    this.setList(true);
  },

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curMenuIdx });
    const { videoList, noteList, liveList } = this.data;

    if (
      (curMenuIdx === 0 && !videoList.length) ||
      (curMenuIdx === 1 && !noteList.length) ||
      (curMenuIdx === 2 && !liveList.length)
    ) {
      this.setList(true);
    }
  },

  onReachBottom() {
    this.setList();
  },

  onPullDownRefresh() {
    this.setList(true);
    wx.stopPullDownRefresh();
  },

  async setHistoryKeywords() {
    const historyKeywords = await mediaService.getHistoryKeywords();
    this.setData({ historyKeywords });
  },

  setList(init = false) {
    switch (this.data.curMenuIdx) {
      case 0:
        this.setVideoList(init);
        break;

      case 1:
        this.setNoteList(init);
        break;

      case 2:
        this.setLiveList(init);
        break;
    }
  },

  async setVideoList(init = false) {
    const limit = 10;
    if (init) {
      this.videoPage = 0;
      this.setData({ videoFinished: false });
    }
    const { keywords, videoList } = this.data;
    const { list = [] } =
      (await mediaService.searchVideoList(keywords, ++this.videoPage, limit)) ||
      {};
    this.setData({
      videoList: init ? list : [...videoList, ...list],
    });
    if (list.length < limit) {
      this.setData({ videoFinished: true });
    }
  },

  async setNoteList(init = false) {
    const limit = 10;
    if (init) {
      this.notePage = 0;
      this.setData({ noteFinished: false });
    }
    const { keywords, noteList } = this.data;
    const { list = [] } =
      (await mediaService.searchNoteList(keywords, ++this.notePage, limit)) ||
      {};
    this.setData({
      noteList: init ? list : [...noteList, ...list],
    });
    if (list.length < limit) {
      this.setData({ noteFinished: true });
    }
  },

  async setLiveList(init = false) {
    const limit = 10;
    if (init) {
      this.livePage = 0;
      this.setData({ liveFinished: false });
    }
    const { keywords, liveList } = this.data;
    const { list = [] } =
      (await mediaService.searchLiveRoomList(
        keywords,
        ++this.livePage,
        limit
      )) || {};
    this.setData({
      liveList: init ? list : [...liveList, ...list],
    });
    // if (list.length < limit) {
    //   this.setData({ liveFinished: true });
    // }
    if (!list.length) {
      this.setData({ liveFinished: true });
    }
  },

  clearHistoryKeywords() {
    wx.showModal({
      content: "确定清空历史搜索记录吗？",
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          this.setData({
            historyKeywords: [],
          });
          mediaService.clearHistoryKeywords();
        }
      },
    });
  },

  navBack() {
    customBack();
  },
});
