import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { calcDistance } from "../../../../../../utils/index";
import {
  commentList,
  nearbyScenicSpotList,
  nearbyHotelList,
  mediaList,
} from "../../../../../../utils/tempData";
import { formatter } from "../../utils/index";
import HotelService from "../../utils/hotelService";

const hotelService = new HotelService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ["checkInDate", "checkOutDate"],
  },

  data: {
    statusBarHeight,
    formatter,
    navBarVisible: false,
    menuList: [],
    curMenuIdx: 0,
    hotelInfo: null,
    imageList: [],
    imageMenuList: [],
    imageCount: 0,
    distance: 0,
    curDot: 1,
    muted: true,
    indexList: [],
    roomTypeList: [],
    roomTypeIndexList: [],
    roomPackageList: [],
    commentList,
    nearbyScenicSpotList,
    nearbyHotelList,
    mediaList,
    curTicketInfo: null,
    noticePopupVisible: false,
    calendarPopupVisibel: false,
  },

  observers: {
    "checkInDate, checkOutDate": function (checkInDate, checkOutDate) {},
  },

  methods: {
    async onLoad({ id }) {
      this.hotelId = +id;
      await this.setHotelInfo();
      await this.setRoomTypeList();
      this.setMenuList();
    },

    async setHotelInfo() {
      const hotelInfo = await hotelService.getHotelInfo(this.hotelId);
      const {
        video,
        cover,
        appearanceImageList,
        interiorImageList,
        roomImageList,
        restaurantImageList,
        environmentImageList,
        longitude: lo2,
        latitude: la2,
      } = hotelInfo;
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
      if (appearanceImageList.length) {
        imageList.push(appearanceImageList[0]);
        imageMenuList.push("外观");
        imageCount += appearanceImageList.length;
        this.imagesList.push(appearanceImageList);
      }
      if (interiorImageList.length) {
        imageList.push(interiorImageList[0]);
        imageMenuList.push("内景");
        imageCount += interiorImageList.length;
        this.imagesList.push(interiorImageList);
      }
      if (roomImageList.length) {
        imageList.push(roomImageList[0]);
        imageMenuList.push("房间");
        imageCount += roomImageList.length;
        this.imagesList.push(roomImageList);
      }
      if (restaurantImageList.length) {
        imageList.push(restaurantImageList[0]);
        imageMenuList.push("餐厅");
        imageCount += restaurantImageList.length;
        this.imagesList.push(restaurantImageList);
      }
      if (environmentImageList.length) {
        imageList.push(environmentImageList[0]);
        imageMenuList.push("环境");
        imageCount += environmentImageList.length;
        this.imagesList.push(environmentImageList);
      }

      const { longitude: lo1, latitude: la1 } = store.locationInfo;
      const distance = calcDistance(la1, lo1, la2, lo2);

      this.setData({
        hotelInfo,
        imageList,
        imageMenuList,
        imageCount,
        distance,
      });
    },

    async setRoomTypeList() {
      const hotelRoomList = await hotelService.getHotelRoomList(this.hotelId);
      const typeList = await hotelService.getRoomTypeOptions(this.hotelId);
      const roomTypeList = typeList.map((item) => {
        const roomList = hotelRoomList.filter(
          (room) => room.typeId === item.id
        );
        return { ...item, roomList, fold: true };
      });
      const roomTypeIndexList = new Array(roomTypeList.length + 1)
        .fill("")
        .map((item, index) => index + 1);
      this.setData({ roomTypeIndexList, roomTypeList, indexList: [1, 2] });
    },

    setMenuList() {
      const { roomPackageList } = this.data;
      const menuList = roomPackageList.length
        ? [
            "酒店房间",
            "酒店套餐",
            "用户点评",
            "热门问答",
            "附近景点",
            "附近酒店",
            "达人入住",
          ]
        : [
            "酒店房间",
            "用户点评",
            "热门问答",
            "附近景点",
            "附近酒店",
            "达人入住",
          ];
      this.setData({ menuList }, () => {
        this.setNavBarVisibleLimit();
        this.setMenuChangeLimitList();
      });
    },

    setNavBarVisibleLimit() {
      const query = wx.createSelectorQuery();
      query.select(".hotel-name").boundingClientRect();
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

    swiperBanner(e) {
      this.setData({
        curDot: e.currentTarget.dataset.index + 1,
      });
    },

    toggleMuted() {
      this.setData({
        muted: !this.data.muted,
      });
    },

    fullScreenPlay() {
      const { video } = this.data.hotelInfo;
      const url = `/pages/subpages/common/video-play/index?url=${video}`;
      wx.navigateTo({ url });
    },

    selectMenu(e) {
      const { index } = e.currentTarget.dataset;
      wx.pageScrollTo({
        scrollTop: this.menuChangeLimitList[index] - statusBarHeight - 100,
      });
    },

    toggleFold(e) {
      const { index } = e.currentTarget.dataset;
      const { fold } = this.data.roomTypeList[index];
      this.setData(
        {
          [`roomTypeList[${index}].fold`]: !fold,
        },
        () => {
          this.selectComponent("#index-bar-wrap").updateData();
          this.selectComponent("#index-bar").updateData();
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
          if (index === 0) {
            return;
          }
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

    checkMoreImage() {
      const menuList = JSON.stringify(this.data.imageMenuList.slice(1));
      const imagesList = JSON.stringify(this.imagesList);
      const url = `./subpages/more-image/index?menuList=${menuList}&imagesList=${imagesList}`;
      wx.navigateTo({ url });
    },

    checkMoreInfo() {
      const url = `./subpages/more-info/index?info=${JSON.stringify(
        this.data.hotelInfo
      )}`;
      wx.navigateTo({ url });
    },

    navigation() {
      const { name, address, latitude, longitude } = this.data.hotelInfo;
      wx.openLocation({
        latitude,
        longitude,
        name,
        address,
      });
    },

    showCalendarPopup() {
      this.setData({
        calendarPopupVisibel: true,
      });
    },

    hideCalendarPopup() {
      this.setData({
        calendarPopupVisibel: false,
      });
    },

    setCalendar(e) {
      const [start, end] = e.detail;
      store.setCheckInDate(start.getTime());
      store.setCheckOutDate(end.getTime());
      this.setData({
        calendarPopupVisibel: false,
      });
    },

    onShareAppMessage() {},
  },
});
