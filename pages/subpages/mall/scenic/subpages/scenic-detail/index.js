import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";
import ScenicService from "../../utils/scenicService";

const scenicService = new ScenicService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    toolVisible: false, // todo 用于前期提交审核隐藏部分功能，后期需要删除
    statusBarHeight,
    pageLoaded: false,
    navBarVisible: false,
    menuList: [],
    curMenuIdx: -1,
    scenicInfo: null,
    curOpenTime: null,
    isOpen: true,
    curDot: 1,
    muted: true,
    ticketTypeList: [],
    curTicketTypeIdx: 0,
    ticketList: [],
    combinedTicketTypeList: [],
    curCombinedTicketTypeIdx: 0,
    combinedTicketList: [],
    mediaList: [],
    loading: false,
    finished: false,
    curTicketInfo: null,
    noticePopupVisible: false,
    posterInfo: null,
    posterModalVisible: false
  },

  async onLoad(options) {
    // todo 用于前期提交审核隐藏部分功能，后期需要删除
    const { envVersion } = wx.getAccountInfoSync().miniProgram || {};
    if (envVersion === "release") {
      this.setData({ toolVisible: true });
    }

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
    this.scenicId = +id || decodedSceneList[0];
    this.superiorId = decodedSceneList[1] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await scenicService.getUserInfo(this.superiorId);
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    await this.setScenicInfo();
    await this.setScenicCategoryOptions();
    await this.setSourceTicketList();
    this.setMenuList();
    this.setData({ pageLoaded: true });
    this.setMediaList(true);
  },

  async setScenicCategoryOptions() {
    this.categoryOptions = await scenicService.getTicketCategoryOptions();
  },

  async setScenicInfo() {
    const scenicInfo = await scenicService.getScenicInfo(this.scenicId);
    this.setData({ scenicInfo });

    const { openTimeList } = scenicInfo;
    openTimeList.length && this.setCurOpenTime(openTimeList);
  },

  setCurOpenTime(openTimeList) {
    const date = new Date();
    const curMonth = date.getMonth() + 1;
    const curOpenTime = openTimeList.find(
      item => curMonth >= item.openMonth && curMonth <= item.closeMonth
    );
    const openTime = Number(curOpenTime.openTime.replace(":", ""));
    const closeTime = Number(curOpenTime.closeTime.replace(":", ""));
    const curTime = Number(
      `${date.getHours()}` + `${date.getMinutes()}`.padStart(2, "0")
    );
    const isOpen = curTime >= openTime && curTime <= closeTime;
    this.setData({ curOpenTime, isOpen });
  },

  async setSourceTicketList() {
    const list = await scenicService.getScenicTicketList(this.scenicId);

    const ticketCategoryIds = [];
    const combinedTicketCategoryIds = [];
    this.ticketList = [];
    this.combinedTicketList = [];

    const curDate = new Date();
    const curHour = `${curDate.getHours()}`.padStart(2, "0");
    const curMinute = `${curDate.getMinutes()}`.padStart(2, "0");
    const curTime = +`${curHour}${curMinute}`;

    list.forEach(({ type, bookingTime, specList, ...rest }) => {
      const todayBookable = curTime <= +bookingTime.replace(":", "");
      const item = {
        ...rest,
        type,
        specList,
        bookingTime,
        todayBookable,
        bookingTips: todayBookable ? "可定今日" : "可定明日",
        categoryIds: specList.map(({ categoryId }) => {
          if (type === 1) {
            ticketCategoryIds.push(categoryId);
          } else {
            combinedTicketCategoryIds.push(categoryId);
          }
          return categoryId;
        })
      };
      if (type === 1) {
        this.ticketList.push(item);
      } else {
        this.combinedTicketList.push(item);
      }
    });

    if (ticketCategoryIds.length) {
      const ticketTypeList = Array.from(new Set(ticketCategoryIds))
        .sort()
        .map(categoryId =>
          this.categoryOptions.find(item => item.id === categoryId)
        );
      this.setData({ ticketTypeList });
      this.setTicketList();
    }

    if (combinedTicketCategoryIds.length) {
      const combinedTicketTypeList = Array.from(
        new Set(combinedTicketCategoryIds)
      )
        .sort()
        .map(categoryId =>
          this.categoryOptions.find(item => item.id === categoryId)
        );
      this.setData({ combinedTicketTypeList });
      this.setCombinedTicketList();
    }
  },

  setTicketList() {
    const { ticketTypeList, curTicketTypeIdx } = this.data;
    const { id: curCategoryId, name: curCategoryName } =
      ticketTypeList[curTicketTypeIdx];
    const ticketList = this._setTicketList(
      curCategoryId,
      curCategoryName,
      this.ticketList
    );
    this.setData({ ticketList });
  },

  setCombinedTicketList() {
    const { combinedTicketTypeList, curCombinedTicketTypeIdx } = this.data;
    const { id: curCategoryId, name: curCategoryName } =
      combinedTicketTypeList[curCombinedTicketTypeIdx];
    const combinedTicketList = this._setTicketList(
      curCategoryId,
      curCategoryName,
      this.combinedTicketList
    );
    this.setData({ combinedTicketList });
  },

  _setTicketList(curCategoryId, curCategoryName, sourceTicketList) {
    const ticketList = [];
    sourceTicketList.forEach(
      ({ type, name, briefName, categoryIds, specList, ...item }) => {
        if (
          categoryIds.findIndex(categoryId => categoryId === curCategoryId) !==
          -1
        ) {
          const priceList = JSON.parse(
            specList.find(spec => spec.categoryId === curCategoryId).priceList
          );
          const curTicketIndex = ticketList.findIndex(
            ticket => ticket.name === item.name
          );
          if (curTicketIndex === -1) {
            ticketList.push({
              name: type === 1 ? briefName : name,
              basePrice: item.price,
              fold: true,
              list: [
                {
                  categoryId: curCategoryId,
                  categoryName: curCategoryName,
                  priceList,
                  type,
                  name,
                  briefName,
                  ...item
                }
              ]
            });
          } else {
            const { basePrice, list, ...rest } = ticketList[curTicketIndex];
            ticketList[curTicketIndex] = {
              ...rest,
              basePrice: item.price < basePrice ? item.price : basePrice,
              list: [
                ...list,
                {
                  categoryId: curCategoryId,
                  categoryName: curCategoryName,
                  priceList,
                  type,
                  name,
                  briefName,
                  ...item
                }
              ]
            };
          }
        }
      }
    );
    return ticketList;
  },

  setMenuList() {
    const { scenicInfo, ticketList, combinedTicketTypeList } = this.data;
    const { evaluationSummary, nearbyHotelSummary, nearbyScenicSummary } =
      scenicInfo;
    const menuList = [
      ticketList.length ||
      (!ticketList.length && !combinedTicketTypeList.length)
        ? "景点门票"
        : "",
      combinedTicketTypeList.length ? "多景点联票" : "",
      evaluationSummary.total ? "用户点评" : "",
      "热门问答",
      nearbyHotelSummary.total ? "附近酒店" : "",
      nearbyScenicSummary ? "附近景点" : "",
      "达人打卡"
    ].filter(item => !!item);
    this.setData({ menuList }, () => {
      this.setNavBarVisibleLimit();
      this.setMenuChangeLimitList();
    });
  },

  setNavBarVisibleLimit() {
    const query = wx.createSelectorQuery();
    query.select(".scenic-name").boundingClientRect();
    query.exec(res => {
      this.navBarVisibleLimit = res[0].bottom;
    });
  },

  setMenuChangeLimitList() {
    const query = wx.createSelectorQuery();
    query.selectAll(".content-title").boundingClientRect();
    query.exec(res => {
      this.menuChangeLimitList = res[0].map(
        item => item.top + (this.scrollTop || 0)
      );
    });
  },

  bannerChange(e) {
    this.setData({
      curDot: e.detail.current + 1
    });
  },

  toggleMuted() {
    this.setData({
      muted: !this.data.muted
    });
  },

  previewMedia(e) {
    const { current } = e.currentTarget.dataset;
    const { video, imageList } = this.data.scenicInfo;
    const sources = imageList.map(url => ({ url, type: "image" }));
    wx.previewMedia({
      sources: video ? [{ url: video, type: "video" }, ...sources] : sources,
      current
    });
  },

  selectMenu(e) {
    const { index } = e.currentTarget.dataset;
    wx.pageScrollTo({
      scrollTop: this.menuChangeLimitList[index] - statusBarHeight - 100
    });
  },

  selectTicketType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData(
      {
        curTicketTypeIdx: Number(index)
      },
      () => {
        this.setTicketList();
        this.setMenuChangeLimitList();
      }
    );
  },

  toggleTicketsFold(e) {
    const index = e.detail;
    const { ticketList } = this.data;
    this.setData(
      {
        [`ticketList[${index}].fold`]: !ticketList[index].fold
      },
      () => {
        this.setMenuChangeLimitList();
      }
    );
  },

  selectCombinedTicketType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData(
      {
        curCombinedTicketTypeIdx: Number(index)
      },
      () => {
        this.setCombinedTicketList();
        this.setMenuChangeLimitList();
      }
    );
  },

  toggleCombinedTicketsFold(e) {
    const index = e.detail;
    const { combinedTicketList } = this.data;
    this.setData(
      {
        [`combinedTicketList[${index}].fold`]: !combinedTicketList[index].fold
      },
      () => {
        this.setMenuChangeLimitList();
      }
    );
  },

  onPageScroll({ scrollTop }) {
    this.scrollTop = scrollTop;
    const { navBarVisible, curMenuIdx } = this.data;

    if (scrollTop >= this.navBarVisibleLimit) {
      !navBarVisible && this.setData({ navBarVisible: true });
    } else {
      navBarVisible && this.setData({ navBarVisible: false });
    }

    const menuLimit = scrollTop + statusBarHeight + 108;
    this.menuChangeLimitList.forEach((item, index) => {
      const preItem = this.menuChangeLimitList[index - 1];
      const nextItem = this.menuChangeLimitList[index + 1];
      if (menuLimit < item && (!preItem || menuLimit >= preItem)) {
        if (curMenuIdx !== index - 1) {
          this.setData({ curMenuIdx: index - 1 });
        }
      }
      if (menuLimit >= item && !nextItem) {
        if (curMenuIdx !== index) {
          this.setData({ curMenuIdx: index });
        }
      }
    });
  },

  onReachBottom() {
    this.setMediaList();
  },

  async setMediaList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ mediaList: [], finished: false });
    }
    this.setData({ loading: true });
    const { list = [] } =
      (await scenicService.getRelativeMediaList(
        1,
        this.scenicId,
        ++this.page
      )) || {};
    this.setData({
      mediaList: init ? list : [...this.data.mediaList, ...list],
      loading: false
    });
    if (!list.length) {
      this.setData({ finished: true });
    }
  },

  share() {
    checkLogin(async () => {
      const scene = store.superiorInfo
        ? `${this.scenicId}-${store.superiorInfo.id}`
        : `${this.scenicId}`;
      const page = "pages/subpages/mall/scenic/subpages/scenic-detail/index";
      const qrCode = await scenicService.getQrCode(scene, page);

      const {
        imageList,
        name: title,
        price,
        salesVolume,
        featureTagList = []
      } = this.data.scenicInfo;

      this.setData({
        posterModalVisible: true,
        posterInfo: {
          cover: imageList[0],
          title,
          price,
          salesVolume,
          tagList: featureTagList.slice(0, 2),
          qrCode
        }
      });
    });
  },

  hidePosterModal() {
    this.setData({
      posterModalVisible: false
    });
  },

  showNoticePopup(e) {
    this.setData({
      curTicketInfo: e.detail,
      noticePopupVisible: true
    });
  },

  hideNoticePopup() {
    this.setData({
      noticePopupVisible: false
    });
  },

  checkMoreInfo() {
    const url = `./subpages/more-info/index?info=${JSON.stringify(
      this.data.scenicInfo
    )}`;
    wx.navigateTo({ url });
  },

  checkPolicy() {
    const url = `./subpages/more-info/index?info=${JSON.stringify(
      this.data.scenicInfo
    )}&scene=policy`;
    wx.navigateTo({ url });
  },

  checkEvaluation() {
    const url = `./subpages/evaluation-list/index?scenicId=${this.scenicId}`;
    wx.navigateTo({ url });
  },

  settleIn() {
    const url = `/pages/subpages/mine/setting/subpages/merchant-settle/index?type=1`;
    wx.navigateTo({ url });
  },

  checkQa() {
    const { id, name } = this.data.scenicInfo;
    const url = `./subpages/qa-list/index?scenicId=${id}&scenicName=${name}`;
    wx.navigateTo({ url });
  },

  navigation() {
    const { name, address, latitude, longitude } = this.data.scenicInfo;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  onShareAppMessage() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, name, imageList } = this.data.scenicInfo;
    const originalPath = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${id}`
    const path = superiorId
      ? `${originalPath}&superiorId=${superiorId}`
      : originalPath;
    return { path, title: name, imageUrl: imageList[0] };
  },

  onShareTimeline() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, name, imageList } = this.data.scenicInfo;
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title: name, imageUrl: imageList[0] };
  }
});
