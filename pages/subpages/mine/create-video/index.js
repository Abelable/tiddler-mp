import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import { debounce } from "../../../../utils/index";
import { QQ_MAP_KEY } from "../../../../config";
import VideoService from "./utils/videoService";

const Map = require("../../utils/libs/qqmap-wx-jssdk.min");
const videoService = new VideoService();

Page({
  data: {
    title: "",
    cover: "",
    address: "",
    addressVisible: true,
    pickedGoodsName: "",
    textareaHeight: 0,
  },

  async onLoad({ tempFilePath }) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
    });

    this.setVideoUrl(tempFilePath);
    this.setLocationInfo();
  },

  async setVideoUrl(tempFilePath) {
    this.videoUrl = await videoService.uploadFile(tempFilePath);
    const cover = `${this.videoUrl}?x-oss-process=video/snapshot,t_0`;
    this.setData({ cover });
  },

  async setLocationInfo() {
    const { authSetting } = await videoService.getSetting();
    if (authSetting["scope.userLocation"] !== false) {
      const { longitude, latitude } = await videoService.getLocation();
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
    this.setData({
      title: e.detail.value,
    });
  }, 200),

  async editCover() {
    const { tempFilePaths } = (await videoService.chooseImage(1)) || {};
    if (tempFilePaths) {
      const cover = (await videoService.uploadFile(tempFilePaths[0])) || "";
      this.setData({ cover });
    }
  },

  pickRelativeCommodity() {
    wx.navigateTo({
      url: "../relative-commodity/index"
    });
  },

  toggleIsPrivate(e) {
    this.isPrivate = e.detail.value ? 1 : 0;
  },

  publish() {
    const { title, cover, address, addressVisible } = this.data;
    const { videoUrl, pickedGoodsId, longitude, latitude, isPrivate } = this;

    if (!title) {
      return;
    }

    const videoInfo = {
      title,
      cover,
      videoUrl,
      isPrivate,
      goodsId: pickedGoodsId,
      longitude: addressVisible ? longitude : 0,
      latitude: addressVisible ? latitude : 0,
      address: addressVisible ? address : "",
    };

    videoService.createVideo(videoInfo, () => {
      wx.navigateBack();
    });
  },

  setTextareaHeight() {
    const query = wx.createSelectorQuery();
    query.select(".cover-wrap").boundingClientRect();
    query.exec((res) => {
      const { height: textareaHeight } = res[0] || {};
      this.setData({ textareaHeight });
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
