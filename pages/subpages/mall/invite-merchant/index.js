import { store } from "../../../../store/index";
import InviteService from "./utils/inviteService";

const inviteService = new InviteService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false,
    merchantList: []
  },

  onLoad() {
  },

  onPullDownRefresh() {
    this.setGoodsList();
    wx.stopPullDownRefresh();
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.headerVisible) {
        this.setData({ headerVisible: true });
      }
    } else {
      if (this.data.headerVisible) {
        this.setData({ headerVisible: false });
      }
    }
  },

  onShareAppMessage() {
    const { id } = store.promoterInfo || {};
    const originalPath = "/pages/subpages/mall/invite-merchant/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return {
      path,
      imageUrl: "https://static.tiddler.cn/mp/invite_merchant/share_cover.png"
    };
  }
});
