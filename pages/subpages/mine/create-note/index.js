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
    pickedCommoditiesName: ""
  },

  async onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["mediaCommodityList"]
    });

    if (!store.locationInfo) {
      await noteService.getLocationInfo();
    }
    this.mapInit();
  },

  openLocationSetting() {
    wx.openSetting({
      success: async () => {
        await noteService.getLocationInfo();
        this.mapInit();
      }
    });
  },

  mapInit() {
    const { longitude, latitude } = store.locationInfo;
    const map = new Map({ key: QQ_MAP_KEY });
    map.reverseGeocoder({
      location: { longitude, latitude },
      success: res => {
        if (res.status === 0) {
          const { address } = res.result;
          this.setData({ address });
          this.longitude = longitude;
          this.latitude = latitude;
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          });
        }
      }
    });
  },

  async uploadImage(e) {
    const { index, file } = e.detail;
    this.setData({
      imageList: [
        ...this.data.imageList,
        { status: "uploading", message: "上传中", deletable: true }
      ]
    });
    const url = (await noteService.uploadFile(file.url)) || "";
    if (url) {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "done",
          message: "上传成功",
          url
        }
      });
    } else {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "fail",
          message: "上传失败"
        }
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
      title: e.detail.value
    });
  }, 200),

  setContent: debounce(function (e) {
    this.setData({
      content: e.detail.value
    });
  }, 200),

  toggleIsPrivate(e) {
    this.isPrivate = e.detail.value ? 1 : 0;
  },

  toggleAddressVisible(e) {
    this.setData({
      addressVisible: e.detail.value
    });
  },

  editAddress: debounce(function (e) {
    this.setData({
      address: e.detail.value
    });
  }, 200),

  pickRelativeCommodity() {
    wx.navigateTo({
      url: "../relative-commodity/index"
    });
  },

  deleteCommodity(e) {
    const { index } = e.currentTarget.dataset;
    const { position, instance } = e.detail;
    if (position === "right") {
      wx.showModal({
        title: "提示",
        content: "确定删除该商品吗？",
        showCancel: true,
        success: async res => {
          if (res.confirm) {
            const commodityList = [...store.mediaCommodityList];
            commodityList.splice(index, 1);
            store.setMediaCommodityList(commodityList);
            instance.close();
          } else {
            instance.close();
          }
        }
      });
    }
  },

  publish() {
    const {
      imageList,
      title,
      content,
      address,
      addressVisible,
      mediaCommodityList
    } = this.data;
    const { longitude, latitude, isPrivate } = this;

    if (!imageList.length || !title || !content) {
      return;
    }

    const noteInfo = {
      imageList: imageList.map(item => item.url),
      title,
      content,
      isPrivate,
      commodityList: mediaCommodityList.map(({ type, id }) => ({ type, id })),
      longitude: addressVisible ? longitude : 0,
      latitude: addressVisible ? latitude : 0,
      address: addressVisible ? address : ""
    };

    noteService.createNote(noteInfo, () => {
      store.setMediaCommodityList([]);
      wx.navigateBack();
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
