import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { calcDistance, checkLogin } from "../../../../../../utils/index";
import { WEBVIEW_BASE_URL } from "../../../../../../config";
import { formatter } from "../../utils/index";
import HotelService from "../../utils/hotelService";

const hotelService = new HotelService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ["checkInDate", "checkOutDate"]
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
    evaluationSummary: null,
    qaSummary: null,
    nearbyScenicList: [],
    nearbyScenicTotal: 0,
    nearbyHotelList: [],
    nearbyHotelTotal: 0,
    mediaList: [],
    finished: false,
    curRoomInfo: null,
    noticePopupVisible: false,
    calendarPopupVisibel: false,
    posterInfo: null,
    posterModalVisible: false
  },

  observers: {
    "checkInDate, checkOutDate": function (checkInDate, checkOutDate) {
      const nightNum = Math.floor(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );
      this.dateList = new Array(nightNum)
        .fill("")
        .map((item, index) => checkInDate + 1000 * 60 * 60 * 24 * index);
    }
  },

  methods: {
    async onLoad(options) {
      const { id, superiorId = "", scene = "" } = options || {};
      const decodedSceneList = scene
        ? decodeURIComponent(scene).split("-")
        : [];
      this.hotelId = +id || decodedSceneList[0];
      this.superiorId = +superiorId || decodedSceneList[1];

      getApp().onLaunched(async () => {
        if (this.superiorId && !store.superiorInfo) {
          wx.setStorageSync("superiorId", this.superiorId);
          const superiorInfo = await hotelService.getUserInfo(this.superiorId);
          if (superiorInfo.promoterInfo) {
            store.setSuperiorInfo(superiorInfo);
          }
        }
      });

      await this.setHotelInfo();
      await this.setRoomTypeList();
      await this.setEvaluationSummary();
      await this.setQaSummary();
      await this.setNearbyScenicList();
      await this.setNearbyHotelList();
      await this.setMediaList(true);
      this.setMenuList();

      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
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
        latitude: la2
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
        distance
      });
    },

    async setRoomTypeList() {
      const hotelRoomList = await hotelService.getHotelRoomList(this.hotelId);
      const typeList = await hotelService.getRoomTypeOptions(this.hotelId);

      const roomTypeList = typeList
        .map(item => {
          const roomList = hotelRoomList
            .filter(room => room.typeId === item.id)
            .map(room => {
              const priceUnitList = this.dateList.map(date =>
                room.priceList.find(
                  priceUnit =>
                    date >= priceUnit.startDate * 1000 &&
                    date <= priceUnit.endDate * 1000
                )
              );
              const price = Number(
                (
                  priceUnitList
                    .map(item => item.price)
                    .reduce((a, b) => Number(a) + Number(b), 0) /
                  priceUnitList.length
                ).toFixed(2)
              );
              const roomNum = Number(
                priceUnitList.sort((a, b) => a.num - b.num)[0].num
              );
              return { ...room, price, roomNum };
            })
            .filter(room => room.roomNum);
          const { price = 0 } =
            roomList.sort((a, b) => a.price - b.price)[0] || {};
          return { ...item, roomList, price, fold: true };
        })
        .filter(item => item.roomList.length);

      const roomTypeIndexList = new Array(roomTypeList.length + 1)
        .fill("")
        .map((item, index) => index + 1);

      this.setData(
        { roomTypeIndexList, roomTypeList, indexList: [1, 2] },
        () => {
          this.redraw();
        }
      );
    },

    async setEvaluationSummary() {
      const { list = [], total } =
        (await hotelService.getHotelEvaluationList(this.hotelId, 1, 2)) || {};
      this.setData({ evaluationSummary: { list, total } });
    },

    async setQaSummary() {
      const qaSummary = await hotelService.getHotelQaSummary(this.hotelId);
      this.setData({ qaSummary });
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
            "达人入住"
          ]
        : [
            "酒店房间",
            "用户点评",
            "热门问答",
            "附近景点",
            "附近酒店",
            "达人入住"
          ];
      this.setData({ menuList }, () => {
        this.setNavBarVisibleLimit();
        this.setMenuChangeLimitList();
      });
    },

    setNavBarVisibleLimit() {
      const query = wx.createSelectorQuery();
      query.select(".hotel-name").boundingClientRect();
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

    fullScreenPlay() {
      const { video } = this.data.hotelInfo;
      const url = `/pages/subpages/common/video-play/index?url=${video}`;
      wx.navigateTo({ url });
    },

    selectMenu(e) {
      const { index } = e.currentTarget.dataset;
      wx.pageScrollTo({
        scrollTop: this.menuChangeLimitList[index] - statusBarHeight - 100
      });
    },

    toggleFold(e) {
      const { index } = e.currentTarget.dataset;
      const { fold } = this.data.roomTypeList[index];
      this.setData(
        {
          [`roomTypeList[${index}].fold`]: !fold
        },
        () => {
          this.redraw();
        }
      );
    },

    redraw() {
      this.selectComponent("#index-bar-wrap").updateData();
      if (this.selectComponent("#index-bar")) {
        this.selectComponent("#index-bar").updateData();
      }
      this.setMenuChangeLimitList();
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
      this.setMediaList();
    },

    async setNearbyScenicList() {
      const { longitude, latitude } = this.data.hotelInfo;
      const { list: nearbyScenicList = [], total: nearbyScenicTotal } =
        await hotelService.getNearbyScenicList({
          longitude,
          latitude,
          page: 1
        });
      this.setData({ nearbyScenicList, nearbyScenicTotal });
    },

    async setNearbyHotelList() {
      const { id, longitude, latitude } = this.data.hotelInfo;
      const { list: nearbyHotelList = [], total: nearbyHotelTotal } =
        await hotelService.getNearbyHotelList({
          id,
          longitude,
          latitude,
          page: 1
        });
      this.setData({ nearbyHotelList, nearbyHotelTotal });
    },

    async setMediaList(init = false) {
      if (init) {
        this.page = 0;
        this.setData({ finished: false });
      }
      const { list = [] } =
        (await hotelService.getRelativeMediaList(
          2,
          this.hotelId,
          ++this.page
        )) || {};
      this.setData({
        mediaList: init ? list : [...this.data.mediaList, ...list]
      });
      if (!list.length) {
        this.setData({ finished: true });
      }
    },

    share() {
      checkLogin(async () => {
        const scene = store.superiorInfo
          ? `${this.hotelId}-${store.superiorInfo.id}`
          : `${this.hotelId}`;
        const page = "pages/subpages/mall/hotel/subpages/hotel-detail/index";
        const qrcode = await hotelService.getQRCode(scene, page);

        const {
          cover,
          name: title,
          price,
          salesVolume,
          featureTagList = []
        } = this.data.hotelInfo;

        this.setData({
          posterModalVisible: true,
          posterInfo: {
            cover,
            title,
            price,
            salesVolume,
            tagList: featureTagList.slice(0, 2),
            qrcode
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
      const { typeIndex, roomIndex } = e.currentTarget.dataset;
      const curRoomInfo = this.setCurRoomInfo(typeIndex, roomIndex);
      this.setData({
        curRoomInfo,
        noticePopupVisible: true
      });
    },

    setCurRoomInfo(typeIndex, roomIndex) {
      const { hotelInfo, roomTypeList } = this.data;
      const { name: hotelName, englishName: hotelEnglishName } = hotelInfo;
      const { id, price, roomList, ...roomTypeInfo } = roomTypeList[typeIndex];
      const { priceList, ...roomInfo } = roomList[roomIndex];
      return {
        hotelName,
        hotelEnglishName,
        ...roomTypeInfo,
        ...roomInfo
      };
    },

    hideNoticePopup() {
      this.setData({
        noticePopupVisible: false
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
        latitude: +latitude,
        longitude: +longitude,
        name,
        address
      });
    },

    showCalendarPopup() {
      this.setData({
        calendarPopupVisibel: true
      });
    },

    hideCalendarPopup() {
      this.setData({
        calendarPopupVisibel: false
      });
    },

    setCalendar(e) {
      const [start, end] = e.detail;
      store.setCheckInDate(start.getTime());
      store.setCheckOutDate(end.getTime());
      this.setData({
        calendarPopupVisibel: false
      });
      this.setRoomTypeList();
    },

    preorder(e) {
      const { typeIndex, roomIndex } = e.currentTarget.dataset;
      const curRoomInfo = this.setCurRoomInfo(typeIndex, roomIndex);
      store.setHotelPreOrderInfo(curRoomInfo);
      wx.navigateTo({
        url: "/pages/subpages/mall/hotel/subpages/order-check/index"
      });
    },

    checkEvaluation() {
      const url = `./subpages/evaluation-list/index?hotelId=${this.hotelId}`;
      wx.navigateTo({ url });
    },

    settleIn() {
      const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/hotel/provider/settle_in`;
      wx.navigateTo({ url });
    },

    checkQa() {
      const { id, name } = this.data.hotelInfo;
      const url = `./subpages/qa-list/index?hotelId=${id}&hotelName=${name}`;
      wx.navigateTo({ url });
    },

    onShareAppMessage() {
      const { id, name, cover } = this.data.hotelInfo;
      const path = store.superiorInfo
        ? `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${id}&superiorId=${store.superiorInfo.id}`
        : `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${id}`;
      return { path, title: name, imageUrl: cover };
    },

    onShareTimeline() {
      const { id, name, cover } = this.data.hotelInfo;
      const query = store.superiorInfo
        ? `id=${id}&superiorId=${store.superiorInfo.id}`
        : `id=${id}`;
      return { query, title: name, imageUrl: cover };
    }
  }
});
