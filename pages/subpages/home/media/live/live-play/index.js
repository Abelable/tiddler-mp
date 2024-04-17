import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { getQueryString } from "../../../../../../utils/index";
import LiveService from "../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    roomList: [],
    curRoomIdx: 0,
    inputPopupVisible: false,
    goodsPopupVisible: false,
    posterInfo: null,
    posterModalVisible: false,
    subscribeModalVisible: false
  },

  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
      actions: ["setLiveMsgList"]
    });

    const { id, scene, q } = options;
    const decodedScene = scene ? decodeURIComponent(scene) : "";
    const decodedQ = q ? decodeURIComponent(q) : "";
    this.roomId =
      id || decodedScene.split("-")[0] || getQueryString(decodedQ, "id");

    this.setRoomList();
  },

  onShow() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
  },

  onHide() {
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },

  changeRoom(e) {
    const { current: curRoomIdx } = e.detail;
    this.setCurRoomIdxTimeout && clearTimeout(this.setCurRoomIdxTimeout);
    this.setCurRoomIdxTimeout = setTimeout(() => {
      this.setData({ curRoomIdx });
    }, 500);
    const { roomList } = this.data;
    curRoomIdx > roomList.length - 5 && this.setRoomList();
  },

  async setRoomList() {
    if (!this.page) this.page = 0;
    const { list = [] } =
      (await liveService.getRoomList(this.roomId, ++this.page)) || {};
    this.setData({
      roomList: [...this.data.roomList, ...list]
    });
  },

  showInputPopup() {
    this.setData({
      inputPopupVisible: true
    });
  },

  showSubscribeModal() {
    this.setData({
      subscribeModalVisible: true
    });
  },

  async share() {
    const { roomList, curRoomIdx } = this.data;
    const {
      id,
      status,
      shareCover: cover,
      title,
      anchorInfo: authorInfo,
      noticeTime,
      startTime
    } = roomList[curRoomIdx];

    const scene = `id=${id}`;
    const page = "pages/tab-bar-pages/home/index";
    const qrcode = await liveService.getQRCode(scene, page);

    this.setData({
      posterModalVisible: true,
      posterInfo: {
        status,
        cover,
        title,
        authorInfo,
        noticeTime,
        startTime,
        qrcode
      }
    });
  },

  hideModal() {
    const { inputPopupVisible, subscribeModalVisible, posterModalVisible } =
      this.data;
    inputPopupVisible && this.setData({ inputPopupVisible: false });
    subscribeModalVisible && this.setData({ subscribeModalVisible: false });
    posterModalVisible && this.setData({ posterModalVisible: false });
  },

  showGoodsPopup() {
    this.setData({ goodsPopupVisible: true });
  },

  hideGoodsPopup() {
    this.setData({ goodsPopupVisible: false });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  onShareAppMessage() {
    const { roomList, curRoomIdx } = this.data;
    const roomInfo = roomList[curRoomIdx];
    const { id, title, cover: imageUrl } = roomInfo;
    const path = `/pages/subpages/index/room/index?id=${id}}`;
    return { path, title, imageUrl };
  },

  onShareTimeline() {
    const { roomList, curRoomIdx } = this.data;
    const roomInfo = roomList[curRoomIdx];
    const { id, title, cover: imageUrl } = roomInfo;
    title = `有播直播间：${title}`;
    const query = `id=${id}`;
    return { query, title, imageUrl };
  }
});
