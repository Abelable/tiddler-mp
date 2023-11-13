import { customBack, debounce } from "../../../../utils/index";
import MediaService from "../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    historyKeywordsList: [],
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
    if (wx.getStorageSync("mediaKeywordsList")) {
      this.setData({
        historyKeywordsList: JSON.parse(wx.getStorageSync("mediaKeywordsList")),
      });
    }
  },

  setKeywords: debounce(function (e) {
    this.setData({
      keywords: e.detail.value,
    });
  }, 500),

  cancelSearch() {
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
    const { curMenuIdx, keywords, isSearching, historyKeywordsList } =
      this.data;
    if (!keywords) {
      return;
    }
    this.setData({
      historyKeywordsList: Array.from(
        new Set([...historyKeywordsList, keywords])
      ),
    });
    if (!isSearching) {
      this.setData({ isSearching: true });
    }
    switch (curMenuIdx) {
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

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curMenuIdx });
    const { videoList, noteList, liveList } = this.data;
    switch (curMenuIdx) {
      case 0:
        if (!videoList.length) {
          this.setVideoList(true);
        }
        break;

      case 1:
        if (!noteList.length) {
          this.setNoteList(true);
        }
        break;

      case 2:
        if (!liveList.length) {
          this.setLiveList(true);
        }
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

  onReachBottom() {
    switch (this.data.curMenuIdx) {
      case 0:
        this.setVideoList();
        break;

      case 1:
        this.setNoteList();
        break;

      case 2:
        this.setLiveList();
        break;
    }
  },

  onPullDownRefresh() {
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
    wx.stopPullDownRefresh();
  },

  clearHistoryKeywords() {
    wx.showModal({
      content: "确定清空历史搜索记录吗？",
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          this.setData({
            historyKeywordsList: [],
          });
          wx.removeStorage({ key: "mediaKeywordsList" });
        }
      },
    });
  },

  navBack() {
    customBack();
  },

  onUnload() {
    wx.setStorage({
      key: "mediaKeywordsList",
      data: JSON.stringify(this.data.historyKeywordsList),
    });
  },
});
