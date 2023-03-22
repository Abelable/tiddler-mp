import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { debounce } from "../../../../utils/index";
import { QQ_MAP_KEY } from "../../../../config";
import NoteService from "./utils/noteService";

const Map = require("../../../../utils/libs/qqmap-wx-jssdk.min");
const noteService = new NoteService();

Page({
  data: {
    title: "",
    cover: "",
    address: "",
    addressVisible: true,
    pickedGoodsName: "",
    goodsPickPopupVisible: false,
  },

  async onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
    });

    this.setLocationInfo();
  },

  async setLocationInfo() {
    const { authSetting } = await noteService.getSetting();
    if (authSetting["scope.userLocation"] !== false) {
      const { longitude, latitude } = await noteService.getLocation();
      const map = new Map({ key: QQ_MAP_KEY });
      map.reverseGeocoder({
        location: { longitude, latitude },
        success: (res) => {
          if (res.status === 0) {
            const { address } = res.result;
            this.setData({ address });
            this.longitude = longitude;
            this.latitude = latitude;
          } else {
            wx.showToast({
              title: res.message,
              icon: "none",
            });
          }
        },
      });
    }
  },

  openLocationSetting() {
    wx.openSetting({
      success: () => {
        this.setLocationInfo();
      },
    });
  },

  toggleAddressVisible(e) {
    this.setData({
      addressVisible: e.detail.value,
    });
  },

  editAddress: debounce(function (e) {
    this.setData({
      address: e.detail.value,
    });
  }, 200),

  setTitle: debounce(function (e) {
    this.title = e.detail.value;
    this.setData({
      title: this.title,
    });
  }, 200),

  async editCover() {
    const { tempFilePaths } = (await noteService.chooseImage(1)) || {};
    if (tempFilePaths) {
      const cover = (await noteService.uploadFile(tempFilePaths[0])) || "";
      this.setData({ cover });
    }
  },

  showGoodsPickerPopup() {
    this.setData({
      goodsPickPopupVisible: true,
    });
  },

  goodsPickerConfirm(e) {
    const { id, name } = e.detail;
    this.setData({
      pickedGoodsName: name,
      goodsPickPopupVisible: false,
    });
    this.pickedGoodsId = id;
  },

  hideGoodsPickerPopup() {
    this.setData({
      goodsPickPopupVisible: false,
    });
  },

  toggleIsPrivate(e) {
    this.isPrivate = e.detail.value ? 1 : 0;
  },

  publish() {
    const { title, cover, address, addressVisible } = this.data;
    const { noteUrl, pickedGoodsId, longitude, latitude, isPrivate } = this;

    if (!title) {
      return;
    }

    const noteInfo = {
      title,
      cover,
      noteUrl,
      isPrivate,
      goodsId: pickedGoodsId,
      longitude: addressVisible ? longitude : 0,
      latitude: addressVisible ? latitude : 0,
      address: addressVisible ? address : "",
    };

    noteService.createNote(noteInfo, () => {
      wx.navigateBack();
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
