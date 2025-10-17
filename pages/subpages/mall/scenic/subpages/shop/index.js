import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";
import ScenicService from "../../utils/scenicService";

const scenicService = new ScenicService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarVisible: false,
    shopInfo: null,
    goodsList: [],
    loading: false,
    finished: false,
    posterInfo: null,
    posterModalVisible: false
  },

  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    const { id, superiorId = "", scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.shopId = +id || decodedSceneList[0];
    this.superiorId = superiorId || decodedSceneList[1] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await scenicService.getUserInfo(this.superiorId);
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    this.setShopInfo();
  },

  async setShopInfo() {
    const shopInfo = await scenicService.getShopInfo(this.shopId);
    this.setData({ shopInfo });
  },

  onReachBottom() {},

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  onPageScroll(e) {
    const { navBarVisible } = this.data;

    // 控制导航栏显隐
    if (e.scrollTop >= 200) {
      if (!navBarVisible) this.setData({ navBarVisible: true });
    } else {
      if (navBarVisible) this.setData({ navBarVisible: false });
    }
  },

  share() {
    checkLogin(async () => {
      const { shopInfo, goodsList } = this.data;
      const { id, type, logo, cover, name: title } = shopInfo;

      const scene = store.superiorInfo
        ? `${id}-${store.superiorInfo.id}`
        : `${id}`;
      const page = "pages/subpages/mall/scenic/subpages/shop/index";
      const qrCode = await scenicService.getQrCode(scene, page);

      this.setData({
        posterModalVisible: true,
        posterInfo: {
          title,
          shopInfo: { type, logo },
          cover: cover || "https://static.tiddler.cn/mp/bg.png",
          imageList: goodsList.map(item => item.cover).slice(0, 6),
          qrCode
        }
      });
    });
  },

  hidePosterModal() {
    this.setData({ posterModalVisible: false });
  },

  onShareAppMessage() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, name: title, cover: imageUrl } = this.data.shopInfo;
    const originalPath = `/pages/subpages/mall/scenic/subpages/shop/index?id=${id}`;
    const path = superiorId
      ? `${originalPath}&superiorId=${superiorId}`
      : originalPath;
    return { title, imageUrl, path };
  },

  onShareTimeline() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, name, image: imageUrl } = this.data.shopInfo;
    const title = `小鱼游景点商家店铺：${name}`;
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title, imageUrl };
  }
});
