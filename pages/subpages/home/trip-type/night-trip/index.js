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
  }
});
