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
    addressVisible: true
  },

  async onLoad({ tempFilePath }) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["mediaProductList"]
    });

    this.setVideoUrl(tempFilePath);
    if (!store.locationInfo) {
      await videoService.getLocationInfo();
    }
    this.mapInit();
  },

  async setVideoUrl(tempFilePath) {
    wx.showLoading({ title: "封面加载中..." });
    this.videoUrl = await videoService.uploadFile(tempFilePath);
    const cover = `${this.videoUrl}?x-oss-process=video/snapshot,t_0`;
    this.setData({ cover });
    wx.hideLoading();
  },

  openLocationSetting() {
    wx.openSetting({
      success: async () => {
        await videoService.getLocationInfo();
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

  setTitle: debounce(function (e) {
    this.setData({
      title: e.detail.value
    });
  }, 200),

  async editCover() {
    const { tempFilePaths } = (await videoService.chooseImage(1)) || {};
    if (tempFilePaths) {
      const cover = (await videoService.uploadFile(tempFilePaths[0])) || "";
      this.setData({ cover });
    }
  },

  pickRelativeProduct() {
    wx.navigateTo({
      url: "../relative-product/index"
    });
  },

  deleteProduct(e) {
    const { index } = e.currentTarget.dataset;
    const { position, instance } = e.detail;
    if (position === "right") {
      wx.showModal({
        title: "提示",
        content: "确定删除该商品吗？",
        showCancel: true,
        success: async res => {
          if (res.confirm) {
            const productList = [...store.mediaProductList];
            productList.splice(index, 1);
            store.setMediaProductList(productList);
            instance.close();
          } else {
            instance.close();
          }
        }
      });
    }
  },

  toggleIsPrivate(e) {
    this.isPrivate = e.detail.value ? 1 : 0;
  },

  publish() {
    const { title, cover, address, addressVisible, mediaProductList } =
      this.data;
    const { videoUrl, longitude, latitude, isPrivate } = this;

    if (!title) {
      return;
    }

    const videoInfo = {
      title,
      cover,
      videoUrl,
      isPrivate,
      productList: mediaProductList.map(({ type, id }) => ({ type, id })),
      longitude: addressVisible ? longitude : 0,
      latitude: addressVisible ? latitude : 0,
      address: addressVisible ? address : ""
    };

    videoService.createVideo(videoInfo, () => {
      store.setMediaProductList([]);
      wx.navigateBack();
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
