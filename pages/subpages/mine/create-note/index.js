import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { debounce } from "../../../../utils/index";
import { QQ_MAP_KEY } from "../../../../config";
import NoteService from "./utils/noteService";

const Map = require("../../utils/libs/qqmap-wx-jssdk.min");
const noteService = new NoteService();

Page({
  data: {
    imageList: [],
    title: "",
    content: "",
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

  async uploadImage(e) {
    const { index, file } = e.detail;
    this.setData({
      imageList: [
        ...this.data.imageList,
        { status: "uploading", message: "上传中", deletable: true },
      ],
    });
    const url = (await noteService.uploadFile(file.url)) || "";
    if (url) {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "done",
          message: "上传成功",
          url,
        },
      });
    } else {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "fail",
          message: "上传失败",
        },
      });
    }
  },

  deleteImage(e) {
    const { imageList } = this.data;
    imageList.splice(e.detail.index, 1);
    this.setData({ imageList });
  },

  setTitle: debounce(function (e) {
    this.setData({
      title: e.detail.value,
    });
  }, 200),

  setContent: debounce(function (e) {
    this.setData({
      content: e.detail.value,
    });
  }, 200),

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
    const { imageList, title, content, address, addressVisible } = this.data;
    const { pickedGoodsId, longitude, latitude, isPrivate } = this;

    if (!imageList.length || !title || !content) {
      return;
    }

    const noteInfo = {
      imageList: JSON.stringify(imageList.map((item) => item.url)),
      title,
      content,
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
