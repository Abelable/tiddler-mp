import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { getQueryString } from "../../../../utils/index";
import RoomService from "./utils/roomService";

const roomService = new RoomService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    roomList: [],
    curRoomIdx: 0,
  },

  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: [
        "userInfo",
        "maskVisible",
        "maskOpcity",
        "goodsModalVisible",
        "inputModalVisible",
        "shareModalVisible",
        "posterModalVisible",
      ],
      actions: ["setLiveMsgList", "showModal", "hideModal"],
    });

    const { id, scene, q } = options;
    const decodedScene = scene ? decodeURIComponent(scene) : "";
    const decodedQ = q ? decodeURIComponent(q) : "";
    this.roomId =
      id || decodedScene.split("-")[0] || getQueryString(decodedQ, "id");

    await this.setRoomList();
    this.setCurRoomInfo();
  },

  onShow() {
    wx.setKeepScreenOn({ keepScreenOn: true }); // 保持屏幕常亮
  },
  
  changeRoom(e) {
    const { current: curRoomIdx } = e.detail;
    this.setCurRoomIdxTimeout && clearTimeout(this.setCurRoomIdxTimeout);
    this.setCurRoomIdxTimeout = setTimeout(() => {
      this.setData({ curRoomIdx });
      this.setCurRoomInfo();
    }, 500);
    const { roomList } = this.data;
    curRoomIdx > roomList.length - 5 && this.setRoomList();
  },

  async setRoomList() {
    const roomList = (await roomService.getRoomLists(this.roomId)) || [];
    this.setData({
      roomList: [...this.data.roomList, ...roomList],
    });
  },

  async setCurRoomInfo() {
    const { roomList, curRoomIdx } = this.data;
    const { id, status } = roomList[curRoomIdx];
    if (status === 1) {
      const { hotGoods, viewersNumber, praiseNumber } =
        (await roomService.getRoomInfo(id)) || {};
      this.setData({
        [`roomList[${curRoomIdx}].hotGoods`]: hotGoods,
      });
    }
  },

  onUnload() {
    this.hideModal();
    this.storeBindings.destroyStoreBindings();
  },

  showSpecModal(e) {},

  showPosterModal() {
    this.showModal("poster");
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
  },
});
