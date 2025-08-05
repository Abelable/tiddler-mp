import { checkLogin, getQueryString } from "../../../../../../utils/index";
import GoodsService from "../../utils/goodsService";

const goodsService = new GoodsService();
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

  onLoad({ id, scene, q }) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    const decodedScene = scene ? decodeURIComponent(scene) : "";
    const decodedQ = q ? decodeURIComponent(q) : "";
    this.shopId =
      id || decodedScene.split("-")[0] || getQueryString(decodedQ, "id");

    this.setShopInfo();
    this.setGoodsList(true);
  },

  async setShopInfo() {
    const shopInfo = await goodsService.getShopInfo(this.shopId);
    this.setData({ shopInfo });
  },

  async setGoodsList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ goodsList: [], finished: false });
    }
    this.setData({ loading: true });
    const list =
      (await goodsService.getShopGoodsList(this.shopId, ++this.page)) ||
      [];
    this.setData({
      goodsList: init ? list : [...this.data.goodsList, ...list],
      loading: false
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  onReachBottom() {
    this.setGoodsList();
  },

  onPullDownRefresh() {
    this.setGoodsList(true);
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
      const { id, type, logo, cover, name: title } = this.data.shopInfo;

      const scene = `id=${id}`;
      const page = "pages/tab-bar-pages/home/index";
      const qrCode = await goodsService.getQrCode(scene, page);

      this.setData({
        posterModalVisible: true,
        posterInfo: {
          title,
          shopInfo: { type, logo },
          cover: cover || "https://static.tiddler.cn/mp/bg.png",
          qrCode
        }
      });
    });
  },

  hidePosterModal() {
    this.setData({ posterModalVisible: false });
  },

  // 分享
  onShareAppMessage() {
    const { id, name: title, cover: imageUrl } = this.data.shopInfo;
    const path = `/pages/subpages/mall/goods/subpages/shop/index?id=${id}`;
    return { title, imageUrl, path };
  },

  onShareTimeline() {
    const { id, name, image: imageUrl } = this.data.shopInfo;
    const title = `小鱼游商家店铺：${name}`;
    const query = `id=${id}`;
    return { query, title, imageUrl };
  }
});
