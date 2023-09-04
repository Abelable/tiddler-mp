import {
  commentList,
  nearbyScenicSpotList,
  nearbyHotelList,
  mediaList,
} from "../../../../../../utils/tempData";
import ScenicService from "../../utils/scenicService";

const scenicService = new ScenicService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
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
    commentList,
    nearbyHotelList,
    nearbyScenicSpotList,
    mediaList,
    curTicketInfo: null,
    noticePopupVisible: false,
  },

  async onLoad({ id }) {
    this.scenicId = +id;
    await this.setScenicCategoryOptions();
    await this.setScenicInfo();
    await this.setSourceTicketList();
    this.setMenuList();
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
      (item) => curMonth >= item.openMonth && curMonth <= item.closeMonth
    );

    const { openTime, closeTime } = curOpenTime;
    const openDate = new Date(openTime);
    const closeDate = new Date(closeTime);
    const openTimeUnit = Number(
      `${openDate.getHours()}` + `${openDate.getMinutes()}`.padStart(2, "0")
    );
    const closeTimeUnit = Number(
      `${closeDate.getHours()}` + `${closeDate.getMinutes()}`.padStart(2, "0")
    );
    const curTime = Number(
      `${date.getHours()}` + `${date.getMinutes()}`.padStart(2, "0")
    );
    const isOpen = curTime >= openTimeUnit && curTime <= closeTimeUnit;

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
        }),
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
        .map((categoryId) =>
          this.categoryOptions.find((item) => item.id === categoryId)
        );
      this.setData({ ticketTypeList });
      this.setTicketList();
    }

    if (combinedTicketCategoryIds.length) {
      const combinedTicketTypeList = Array.from(
        new Set(combinedTicketCategoryIds)
      )
        .sort()
        .map((categoryId) =>
          this.categoryOptions.find((item) => item.id === categoryId)
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
          categoryIds.findIndex(
            (categoryId) => categoryId === curCategoryId
          ) !== -1
        ) {
          const priceList = JSON.parse(
            specList.find((spec) => spec.categoryId === curCategoryId).priceList
          );
          const curTicketIndex = ticketList.findIndex(
            (ticket) => ticket.name === item.name
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
                  ...item,
                },
              ],
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
                  ...item,
                },
              ],
            };
          }
        }
      }
    );
    return ticketList;
  },

  setMenuList() {
    const { combinedTicketTypeList } = this.data;
    const menuList = combinedTicketTypeList.length
      ? [
          "景点门票",
          "多景点联票",
          "用户点评",
          "热门问答",
          "附近酒店",
          "附近景点",
          "达人打卡",
        ]
      : [
          "景点门票",
          "用户点评",
          "热门问答",
          "附近酒店",
          "附近景点",
          "达人打卡",
        ];
    this.setData({ menuList }, () => {
      this.setNavBarVisibleLimit();
      this.setMenuChangeLimitList();
    });
  },

  setNavBarVisibleLimit() {
    const query = wx.createSelectorQuery();
    query.select(".scenic-spot-name").boundingClientRect();
    query.exec((res) => {
      this.navBarVisibleLimit = res[0].bottom;
    });
  },

  setMenuChangeLimitList() {
    const query = wx.createSelectorQuery();
    query.selectAll(".content-title").boundingClientRect();
    query.exec((res) => {
      this.menuChangeLimitList = res[0].map(
        (item) => item.top + (this.scrollTop || 0)
      );
    });
  },

  bannerChange(e) {
    this.setData({
      curDot: e.detail.current + 1,
    });
  },

  toggleMuted() {
    this.setData({
      muted: !this.data.muted,
    });
  },

  fullScreenPlay() {
    const { video } = this.data.scenicInfo;
    const url = `/pages/subpages/common/video-play/index?url=${video}`;
    wx.navigateTo({ url });
  },

  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({ current, urls });
  },

  selectMenu(e) {
    const { index } = e.currentTarget.dataset;
    wx.pageScrollTo({
      scrollTop: this.menuChangeLimitList[index] - statusBarHeight - 100,
    });
  },

  selectTicketType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData(
      {
        curTicketTypeIdx: Number(index),
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
        [`ticketList[${index}].fold`]: !ticketList[index].fold,
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
        curCombinedTicketTypeIdx: Number(index),
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
        [`combinedTicketList[${index}].fold`]: !combinedTicketList[index].fold,
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
    console.log("onReachBottom");
  },

  showNoticePopup(e) {
    this.setData({
      curTicketInfo: e.detail,
      noticePopupVisible: true,
    });
  },

  hideNoticePopup() {
    this.setData({
      noticePopupVisible: false,
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

  navigation() {
    const { name, address, latitude, longitude } = this.data.scenicInfo;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
    });
  },

  onShareAppMessage() {},
});
