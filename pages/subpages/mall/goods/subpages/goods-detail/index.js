import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";
import GoodsService from "../../utils/goodsService";

const goodsService = new GoodsService();
const { statusBarHeight } = getApp().globalData.systemInfo;
const navBarHeight = statusBarHeight + 44;

Page({
  data: {
    statusBarHeight,
    pageLoaded: false,
    showNavBar: false,
    evaluationActive: false,
    detailActive: false,
    curDot: 1,
    goodsInfo: null,
    selectedSkuIndex: 0,
    commission: 0,
    commissionVisible: false,
    evaluationSummary: null,
    cartGoodsNumber: 0,
    servicePopupVisible: false,
    selectedSpecDesc: "",
    specPopupVisible: false,
    actionMode: 0,
    addressPopupVisible: false,
    recommendGoodsList: [],
    loading: false,
    finished: false,
    posterInfo: null,
    posterModalVisible: false
  },

  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"]
    });

    const { id, scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.goodsId = +id || decodedSceneList[0];
    this.superiorId = decodedSceneList[1] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await goodsService.getUserInfo(this.superiorId);
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    this.init();
  },

  onShow() {
    checkLogin(() => {
      this.setCartGoodsNumber();
    }, false);
  },

  async init() {
    await this.setGoodsInfo();
    await this.setEvaluationSummary();
    if (!this.data.pageLoaded) {
      this.setData({ pageLoaded: true }, () => {
        this.getInfoWrapTop();
        this.getEvaluationTop();
        this.getDetailTop();
      });
    }
    this.setCommission();
    this.setRecommendGoodsList(true);
  },

  async setGoodsInfo() {
    const goodsInfo = await goodsService.getGoodsInfo(
      this.goodsId,
      this.addressId
    );
    this.setData({ goodsInfo });
  },

  async setEvaluationSummary() {
    const evaluationSummary = await goodsService.getGoodsEvaluationSummary(
      this.goodsId
    );
    this.setData({ evaluationSummary });
  },

  setCommission() {
    const { goodsInfo, selectedSkuIndex } = this.data;
    const {
      skuList = [],
      price: basePrice,
      salesCommissionRate: baseSalesCommissionRate,
      promotionCommissionRate,
      promotionCommissionUpperLimit
    } = goodsInfo;
    const {
      price: skuPrice = 0,
      salesCommissionRate: skuSalesCommissionRate = 0
    } = skuList[selectedSkuIndex] || {};
    const price = skuPrice || basePrice;
    const salesCommissionRate =
      skuSalesCommissionRate || baseSalesCommissionRate;
    const commission =
      Math.round(
        price * (salesCommissionRate / 100) * promotionCommissionRate
      ) / 100;
    this.setData({
      commission: Math.min(commission, promotionCommissionUpperLimit)
    });
  },

  async setRecommendGoodsList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ recommendGoodsList: [], finished: false });
    }
    const { goodsInfo, recommendGoodsList } = this.data;
    const { id, shopCategoryId } = goodsInfo;

    this.setData({ loading: true });
    const list = await goodsService.getRecommedGoodsList(
      [id],
      [shopCategoryId],
      ++this.page
    );
    this.setData({
      recommendGoodsList: init ? list : [...recommendGoodsList, ...list],
      loading: false
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  async setCartGoodsNumber() {
    const cartGoodsNumber = await goodsService.getCartGoodsNumber();
    this.setData({ cartGoodsNumber });
  },

  getInfoWrapTop() {
    const query = wx.createSelectorQuery();
    query.select(".container").boundingClientRect();
    query.exec(res => {
      this.infoWrapTop = res[0].top;
    });
  },

  // 获取评价部分离窗口顶部的距离
  getEvaluationTop() {
    if (this.data.evaluationSummary.total) {
      const query = wx.createSelectorQuery();
      query.select(".evaluation-summary-wrap").boundingClientRect();
      query.exec(res => {
        if (res[0] !== null) {
          this.evaluationTop = res[0].top - 8;
        }
      });
    }
  },

  // 获取详情部分离窗口顶部的距离
  getDetailTop() {
    const query = wx.createSelectorQuery();
    query.select(".goods-detail").boundingClientRect();
    query.exec(res => {
      if (res[0] !== null) {
        this.detailTop = res[0].top;
      }
    });
  },

  // 监听滚动
  onPageScroll(e) {
    const { showNavBar, evaluationActive, detailActive } = this.data;

    // 控制导航栏显隐
    if (e.scrollTop >= this.infoWrapTop - navBarHeight) {
      if (!showNavBar) this.setData({ showNavBar: true });
    } else {
      if (showNavBar) this.setData({ showNavBar: false });
    }

    // 控制导航栏tab的状态切换
    if (this.evaluationTop) {
      if (e.scrollTop < this.evaluationTop - navBarHeight) {
        if (evaluationActive) this.setData({ evaluationActive: false });
        if (detailActive) this.setData({ detailActive: false });
      } else if (
        e.scrollTop >= this.evaluationTop - navBarHeight &&
        e.scrollTop < this.detailTop - navBarHeight
      ) {
        if (!evaluationActive) this.setData({ evaluationActive: true });
        if (detailActive) this.setData({ detailActive: false });
      } else {
        if (evaluationActive) this.setData({ evaluationActive: false });
        if (!detailActive) this.setData({ detailActive: true });
      }
    } else {
      if (e.scrollTop >= this.detailTop - navBarHeight) {
        if (!detailActive) this.setData({ detailActive: true });
      } else {
        if (detailActive) this.setData({ detailActive: false });
      }
    }
  },

  // 滚动到顶部
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },

  // 滚动到评价部分
  scrollToEvaluation() {
    wx.pageScrollTo({
      scrollTop: this.evaluationTop - navBarHeight
    });
  },

  // 滚动到详情部分
  scrollToDetail() {
    wx.pageScrollTo({
      scrollTop: this.detailTop - navBarHeight
    });
  },

  bannerChange(event) {
    this.setData({
      curDot: event.detail.current + 1
    });
  },

  switchBanner(e) {
    const curDot = e.currentTarget.dataset.index;
    this.setData({ curDot });
  },

  previewMedia(e) {
    const { current } = e.currentTarget.dataset;
    const { video, imageList } = this.data.goodsInfo;
    const sources = imageList.map(url => ({ url, type: "image" }));
    wx.previewMedia({
      sources: video ? [{ url: video, type: "video" }, ...sources] : sources,
      current
    });
  },

  toggleCommissionVisible() {
    this.setData({
      commissionVisible: !this.data.commissionVisible
    });
  },

  // 客服
  contact() {
    if (this.data.goodsInfo.shopInfo) {
      const { id, name, avatar } = this.data.goodsInfo.shopInfo.keeperInfo;
      const url = `/pages/subpages/notice/chat/index?userId=${id}&name=${name}&avatar=${avatar}&goodsId=${this.goodsId}`;
      wx.navigateTo({ url });
    }
  },

  showSpecPopup(e) {
    const { status, stock } = this.data.goodsInfo;
    if (status === 1 && stock) {
      const { mode = 0 } = e.currentTarget.dataset;
      this.setData({
        specPopupVisible: true,
        actionMode: mode
      });
    }
  },

  selectSpec(e) {
    const { selectedSkuIndex } = e.detail;
    this.setData({ selectedSkuIndex });
    this.setCommission();
  },

  addCartSuccess(e) {
    const { cartGoodsNumber } = e.detail;
    this.setData({ cartGoodsNumber, specPopupVisible: false });
  },

  hideSpecPopup() {
    this.setData({ specPopupVisible: false });
  },

  showAddressPopup() {
    this.setData({
      addressPopupVisible: true
    });
  },

  confirmAddressSelect(e) {
    this.addressId = e.detail.id;
    this.setGoodsInfo();
    this.setCommission();
    this.hideAddressPopup();
  },

  hideAddressPopup() {
    this.setData({
      addressPopupVisible: false
    });
  },

  showServicePopup() {
    this.setData({ servicePopupVisible: true });
  },

  hideServicePopup() {
    this.setData({ servicePopupVisible: false });
  },

  share() {
    checkLogin(async () => {
      const scene = store.superiorInfo
        ? `${this.goodsId}-${store.superiorInfo.id}`
        : `${this.goodsId}`;
      const page = "pages/subpages/mall/goods/subpages/goods-detail/index";
      const qrCode = await goodsService.getQrCode(scene, page);

      const {
        cover,
        name: title,
        price,
        marketPrice,
        salesVolume
      } = this.data.goodsInfo;

      this.setData({
        posterModalVisible: true,
        posterInfo: { cover, title, price, marketPrice, salesVolume, qrCode }
      });
    });
  },

  hidePosterModal() {
    this.setData({
      posterModalVisible: false
    });
  },

  // 通过遮罩关闭弹窗
  hideModal() {
    this.data.shareModalVisible && this.setData({ shareModalVisible: false });
    this.data.posterModalVisible && this.setData({ posterModalVisible: false });
    this.data.showMask && this.setData({ showMask: false });
  },

  checkEvaluationDetail() {
    const { avgScore } = this.data.evaluationSummary;
    const url = `./subpages/evaluation-list/index?goodsId=${this.goodsId}&avgScore=${avgScore}`;
    wx.navigateTo({ url });
  },

  onReachBottom() {
    this.setRecommendGoodsList();
  },

  onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, name: title, cover: imageUrl } = this.data.goodsInfo;
    const path = superiorId
      ? `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}&superiorId=${superiorId}`
      : `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}`;
    return { title, imageUrl, path };
  },

  onShareTimeline() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, name: title, cover: imageUrl } = this.data.goodsInfo;
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title, imageUrl };
  }
});
