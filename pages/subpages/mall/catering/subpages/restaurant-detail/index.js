import { createStoreBindings } from "mobx-miniprogram-bindings";
import dayjs from "dayjs";
import { store } from "../../../../../../store/index";
import {
  weekDayList,
  calcDistance,
  checkLogin
} from "../../../../../../utils/index";
import CateringService from "../../utils/cateringService";

const cateringService = new CateringService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    toolVisible: false, // todo 用于前期提交审核隐藏部分功能，后期需要删除
    statusBarHeight,
    navBarVisible: false,
    pageLoaded: false,
    menuList: [],
    curMenuIdx: -1,
    restaurantInfo: null,
    openStatus: false,
    openTimeDescList: [],
    curDot: 1,
    muted: true,
    telList: [],
    facilityList: [],
    imageList: [],
    imageMenuList: [],
    imageCount: 0,
    distance: "",
    mediaList: [],
    loading: false,
    finished: false,
    noticePopupVisible: false,
    telPopupVisible: false,
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
    this.restaurantId = +id || decodedSceneList[0];
    this.superiorId = decodedSceneList[1] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await cateringService.getUserInfo(this.superiorId);
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    await this.setRestaurantInfo();
    this.setMenuList();
    this.setData({ pageLoaded: true });
    this.setMediaList(true);
  },

  async setRestaurantInfo() {
    const restaurantInfo = await cateringService.getRestaurantInfo(
      this.restaurantId
    );
    const {
      telList = [],
      openTimeList = [],
      facilityList = [],
      video,
      cover,
      environmentImageList = [],
      foodImageList = [],
      priceImageList = [],
      longitude: lo2,
      latitude: la2
    } = restaurantInfo;

    openTimeList.length && this.setCurOpenTime(openTimeList);

    const imageList = [];
    const imageMenuList = [];
    let imageCount = 0;
    this.imagesList = [];
    if (video) {
      imageMenuList.push("视频");
    } else {
      imageList.push(cover);
      imageMenuList.push("封面");
    }
    if (foodImageList.length) {
      imageList.push(foodImageList[0]);
      imageMenuList.push("菜品");
      imageCount += foodImageList.length;
      this.imagesList.push(foodImageList);
    }
    if (environmentImageList.length) {
      imageList.push(environmentImageList[0]);
      imageMenuList.push("环境");
      imageCount += environmentImageList.length;
      this.imagesList.push(environmentImageList);
    }
    if (priceImageList.length) {
      imageList.push(priceImageList[0]);
      imageMenuList.push("价目表");
      imageCount += priceImageList.length;
      this.imagesList.push(priceImageList);
    }

    const { longitude: lo1 = 0, latitude: la1 = 0 } = store.locationInfo || {};
    const distance = lo1 ? calcDistance(la1, lo1, la2, lo2) : 0;

    this.setData({
      restaurantInfo,
      telList: telList.map(item => ({ name: item, color: "#1989fa" })),
      facilityList: facilityList.slice(0, 4),
      imageList,
      imageMenuList,
      imageCount,
      distance
    });
  },

  setCurOpenTime(openTimeList) {
    const curWeekDay = dayjs().day() + 1;
    const curTime = dayjs().format("HH:mm");
    const openTimeDescList = openTimeList.map(time => {
      if (curWeekDay >= time.startWeekDay && curWeekDay <= time.endWeekDay) {
        const timeFrameIdx = time.timeFrameList.findIndex(timeFrame => {
          const _curTime = +curTime.replace(":", "");
          const _openTime = +timeFrame.openTime.replace(":", "");
          const _closeTime = +timeFrame.closeTime.replace(":", "");
          return _curTime >= _openTime && _curTime <= _closeTime;
        });
        this.setData({ openStatus: timeFrameIdx !== -1 });
      }
      const startWeekDay = weekDayList.find(
        week => week.value == time.startWeekDay
      ).text;
      const endWeekDay = weekDayList.find(
        week => week.value == time.endWeekDay
      ).text;
      const timeFrameDesc = time.timeFrameList
        .map(timeFrame => `${timeFrame.openTime}-${timeFrame.closeTime}`)
        .join();
      return `${startWeekDay}至${endWeekDay}: ${timeFrameDesc}`;
    });

    this.setData({ openTimeDescList });
  },

  async setSourceTicketList() {
    const list = await cateringService.getScenicTicketList(this.restaurantId);

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
    const { mealTicketList, setMealList, evaluationSummary } =
      this.data.restaurantInfo;
    const menuList = [
      mealTicketList.length || (!mealTicketList.length && !setMealList.length)
        ? "代金券"
        : "",
      setMealList.length ? "套餐" : "",
      evaluationSummary.total ? "用户点评" : "",
      "热门问答",
      "达人打卡"
    ].filter(item => !!item);
    this.setData({ menuList }, () => {
      this.setNavBarVisibleLimit();
      this.setMenuChangeLimitList();
    });
  },

  async setMediaList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ mediaList: [], finished: false });
    }

    this.setData({ loading: true });
    const { list = [] } =
      (await cateringService.getRelativeMediaList(
        3,
        this.restaurantId,
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

  setNavBarVisibleLimit() {
    const query = wx.createSelectorQuery();
    query.select(".restaurant-name").boundingClientRect();
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

  swiperBanner(e) {
    this.setData({
      curDot: e.currentTarget.dataset.index + 1
    });
  },

  toggleMuted() {
    this.setData({
      muted: !this.data.muted
    });
  },

  previewMedia(e) {
    const { current } = e.currentTarget.dataset;
    const { restaurantInfo, imageList } = this.data;
    const sources = imageList.map(url => ({ url, type: "image" }));
    wx.previewMedia({
      sources: restaurantInfo.video
        ? [{ url: restaurantInfo.video, type: "video" }, ...sources]
        : sources,
      current
    });
  },

  checkMoreImage() {
    const menuList = JSON.stringify(this.data.imageMenuList.slice(1));
    const imagesList = JSON.stringify(this.imagesList);
    const url = `./subpages/more-image/index?menuList=${menuList}&imagesList=${imagesList}`;
    wx.navigateTo({ url });
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

  share() {
    checkLogin(async () => {
      const scene = store.superiorInfo
        ? `${this.restaurantId}-${store.superiorInfo.id}`
        : `${this.restaurantId}`;
      const page =
        "pages/subpages/mall/catering/subpages/restaurant-detail/index";
      const qrCode = await cateringService.getQrCode(scene, page);

      const {
        cover,
        name: title,
        price,
        salesVolume,
        facilityList = []
      } = this.data.restaurantInfo;

      this.setData({
        posterModalVisible: true,
        posterInfo: {
          cover,
          title,
          price,
          salesVolume,
          tagList: facilityList.slice(0, 2),
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

  checkMoreInfo() {
    const url = `./subpages/more-info/index?info=${JSON.stringify(
      this.data.restaurantInfo
    )}`;
    wx.navigateTo({ url });
  },

  checkPolicy() {
    const url = `./subpages/more-info/index?info=${JSON.stringify(
      this.data.restaurantInfo
    )}&scene=policy`;
    wx.navigateTo({ url });
  },

  navigation() {
    const { name, address, latitude, longitude } = this.data.restaurantInfo;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address
    });
  },

  checkEvaluation() {
    const url = `./subpages/evaluation-list/index?restaurantId=${this.restaurantId}`;
    wx.navigateTo({ url });
  },

  checkQa() {
    const { id, name } = this.data.restaurantInfo;
    const url = `./subpages/qa-list/index?restaurantId=${id}&restaurantName=${name}`;
    wx.navigateTo({ url });
  },

  callTel(e) {
    wx.makePhoneCall({ phoneNumber: e.detail.name });
  },

  showTelPopup() {
    this.setData({ telPopupVisible: true });
  },

  hideTelVisible() {
    this.setData({ telPopupVisible: false });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  onShareAppMessage() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, name, cover } = this.data.restaurantInfo;
    const path = superiorId
      ? `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${id}&superiorId=${superiorId}`
      : `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${id}`;
    return { path, title: name, imageUrl: cover };
  },

  onShareTimeline() {
    const { id: superiorId } = store.superiorInfo || {};
    const { id, name, cover } = this.data.restaurantInfo;
    const query = superiorId ? `id=${id}&superiorId=${superiorId}` : `id=${id}`;
    return { query, title: name, imageUrl: cover };
  }
});
