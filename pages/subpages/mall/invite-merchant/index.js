import { store } from "../../../../store/index";
import InviteService from "./utils/inviteService";

const inviteService = new InviteService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false,
    curMenuIdx: 0,
    menuFixed: false,
    merchantList: []
  },

  onLoad() {
    setTimeout(() => {
      this.getMenuTop();
    }, 1000);
  },

  selectMenu(e) {
    const { index: curMenuIdx } = e.currentTarget.dataset;
    this.setData({ curMenuIdx });
  },

  getMenuTop() {
    const query = wx.createSelectorQuery();
    query.select(".menu-list").boundingClientRect();
    query.exec(res => {
      if (res[0] !== null) {
        this.menuTop = res[0].top - statusBarHeight - 44;
      }
    });
  },

  onPullDownRefresh() {
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

    if (!this.data.menuFixed && e.scrollTop >= this.menuTop) {
      this.setData({ menuFixed: true });
    }
    if (this.data.menuFixed && e.scrollTop < this.menuTop) {
      this.setData({ menuFixed: false });
    }
  },

  onShareAppMessage() {
    const { id } = store.promoterInfo || {};
    const originalPath = "/pages/subpages/mall/invite-merchant/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return {
      path,
      title: "邀商家入驻，拿百元奖励",
      imageUrl: "https://static.tiddler.cn/mp/invite_merchant/share_cover.png"
    };
  }
});
