import FanService from "./utils/fanService";

const fanService = new FanService();

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curMenuIdx: 0,
    followList: [],
    fanList: [],
  },

  onLoad() {},
});
