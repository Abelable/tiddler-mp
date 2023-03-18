import { debounce } from "../../../../utils/index";
import VideoService from "./utils/videoService";
import { QQ_MAP_KEY } from '../../../../config'

const Map = require('../../../../utils/libs/qqmap-wx-jssdk.min')
const videoService = new VideoService();

Page({
  data: {
    title: "",
    cover: "",
    location: '',
    locationVisible: true,
    btnActive: false,
  },

  async onLoad({ tempFilePath }) {
    this.setVideoUrl(tempFilePath);
    this.setLocationInfo()
  },

  async setVideoUrl(tempFilePath) {
    this.videoUrl = await videoService.uploadFile(tempFilePath);
    const cover = `${this.videoUrl}?x-oss-process=video/snapshot,t_0`;
    this.setData({ cover });
  },

  async setLocationInfo() {
    const { authSetting } = await videoService.getSetting()
    if (authSetting['scope.userLocation'] !== false) {
      const info = await videoService.getLocation()
      console.log('经纬度', info)
      const { longitude, latitude } = info
      const map = new Map({ key: QQ_MAP_KEY })
      map.reverseGeocoder({
        location: { longitude, latitude },
        success: res => {
          console.log('locationInfo', res)
        }
      })
    }
  },

  toggleLoctionVisible() {
    const { location, locationVisible } = this.data
    if (!location) {
      wx.openSetting({
        success: () => {
          this.setLocationInfo()
        }
      }) 
      return
    }
    this.setData({
      locationVisible: !locationVisible,
    });
  },

  setTitle: debounce(function (e) {
    this.title = e.detail.value;
    this.setData({
      title: this.title,
    });
    this.check();
  }, 200),

  async editCover() {
    const { tempFilePaths } = (await videoService.chooseImage(1)) || {};
    if (tempFilePaths) {
      const cover = (await videoService.uploadFile(tempFilePaths[0])) || "";
      this.setData({ cover });
    }
  },

  setGoodsDesc(e) {
    this.goodsDesc = e.detail.value;
    this.check();
  },

  switchChange(e) {
    this.isPrivate = e.detail.value ? 1 : 0;
  },

  check() {
    const { title, shortVideoGoodsId, btnActive } = this.data;
    const truthy =
      (shortVideoGoodsId && this.goodsDesc && title) ||
      (!shortVideoGoodsId && title);
    if (btnActive !== truthy) this.setData({ btnActive: truthy });
  },

  selectTag(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      [`tagLists[${index}].selected`]: !this.data.tagLists[index].selected,
    });
  },

  async publish() {
    if (this.data.btnActive) {
      const {
        title,
        cover,
        isPrivate,
        tagLists,
        locationVisible,
        province,
        city,
      } = this.data;
      let tagIdsArr = [];
      tagLists.forEach((item) => {
        if (item.selected) tagIdsArr.push(item.id);
      });
      await videoService.creatShortVideo(
        title,
        cover,
        this.src,
        isPrivate,
        this.goodsDesc,
        tagIdsArr.join(),
        locationVisible ? this.longitude : "",
        locationVisible ? this.latitude : "",
        locationVisible ? province : "",
        locationVisible ? city : ""
      );
      wx.navigateBack();
    }
  },
});
