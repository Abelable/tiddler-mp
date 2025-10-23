import { store } from "../../../../../store/index";
import MediaService from "../../utils/mediaService";

const mediaService = new MediaService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    scenicList: []
  },

  async onLoad() {
    const scenicList = await mediaService.getNightTripList();
    this.setData({ scenicList });
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath = "/pages/subpages/home/theme/night-trip/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return { path, title: "夜游千岛" };
  }
});
