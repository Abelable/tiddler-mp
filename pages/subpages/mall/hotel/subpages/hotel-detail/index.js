import { store } from "../../../../../../store/index";
import { calcDistance } from "../../../../../../utils/index";
import HotelService from "../../utils/hotelService";

const hotelService = new HotelService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    formatter(day) {
      if (day.type === "start") {
        day.bottomInfo = "入住";
      } else if (day.type === "end") {
        day.bottomInfo = "退房";
      }
      return day;
    },
    navBarVisible: false,
    menuList: [],
    curMenuIdx: 0,
    hotelInfo: null,
    video: "",
    cover: "",
    imageList: [],
    imageMenuList: [],
    imageCount: 0,
    distance: 0,
    curDot: 1,
    muted: true,
    indexList: [],
    roomTypeList: [],
    roomTypeIndexList: [],
    ticketTypeList: [],
    curTicketTypeIdx: 0,
    ticketList: [],
    combinedTicketTypeList: [],
    curCombinedTicketTypeIdx: 0,
    combinedTicketList: [],
    commentList: [
      {
        userInfo: {
          avatar:
            "http://img.ubo.vip/uploads/15099395_642329416d5f9/i0hX323HiYx8uIbCsHISlbbDATrzieNfFUgcfhHf.jpeg",
          nickname: "沫沫",
        },
        rate: 4.2,
        content:
          "下一次恋爱要从纯爱开始，支支吾吾地把我约出来，结果只是为了看今晚的月色的美丽，为了听拂过耳畔的风，为了送一份我随口一说想吃的提拉米苏。他是坦诚的，明亮的，会在汹涌的人群里朝我伸出手，也会傻傻倚在楼下老榕树旁等我。不小心碰到了手，脸明明红得像个柿子，还要傲娇地说：“要不要和我牵个手呀？",
        imageList: [
          "http://img.ubo.vip/uploads/15099395_6423292630915/xBIuViXth3XLAxeqT4CUFCNNLIK2hBFgdwhqNs7J.jpeg",
          "http://img.ubo.vip/uploads/15099395_642329267e4f8/ISOiz9t2EvRE6qVtFZ2xjh32jZClfYnArgw6hzIZ.jpeg",
          "http://img.ubo.vip/uploads/15099395_64232926ec7c3/P8vDwhVWkc2mhCcYBkGc7gQC0gTAfgXSFXm9s19D.jpeg",
          "http://img.ubo.vip/uploads/15099395_6423292630915/xBIuViXth3XLAxeqT4CUFCNNLIK2hBFgdwhqNs7J.jpeg",
          "http://img.ubo.vip/uploads/15099395_642329267e4f8/ISOiz9t2EvRE6qVtFZ2xjh32jZClfYnArgw6hzIZ.jpeg",
          "http://img.ubo.vip/uploads/15099395_64232926ec7c3/P8vDwhVWkc2mhCcYBkGc7gQC0gTAfgXSFXm9s19D.jpeg",
        ],
      },
      {
        userInfo: {
          avatar:
            "http://img.ubo.vip/uploads/15099395_642329416d5f9/i0hX323HiYx8uIbCsHISlbbDATrzieNfFUgcfhHf.jpeg",
          nickname: "沫沫",
        },
        rate: 4.2,
        content:
          "下一次恋爱要从纯爱开始，支支吾吾地把我约出来，结果只是为了看今晚的月色的美丽，为了听拂过耳畔的风，为了送一份我随口一说想吃的提拉米苏。他是坦诚的，明亮的，会在汹涌的人群里朝我伸出手，也会傻傻倚在楼下老榕树旁等我。不小心碰到了手，脸明明红得像个柿子，还要傲娇地说：“要不要和我牵个手呀？",
        imageList: [
          "http://img.ubo.vip/uploads/15099395_6423292630915/xBIuViXth3XLAxeqT4CUFCNNLIK2hBFgdwhqNs7J.jpeg",
          "http://img.ubo.vip/uploads/15099395_642329267e4f8/ISOiz9t2EvRE6qVtFZ2xjh32jZClfYnArgw6hzIZ.jpeg",
          "http://img.ubo.vip/uploads/15099395_64232926ec7c3/P8vDwhVWkc2mhCcYBkGc7gQC0gTAfgXSFXm9s19D.jpeg",
          "http://img.ubo.vip/uploads/15099395_6423292630915/xBIuViXth3XLAxeqT4CUFCNNLIK2hBFgdwhqNs7J.jpeg",
          "http://img.ubo.vip/uploads/15099395_642329267e4f8/ISOiz9t2EvRE6qVtFZ2xjh32jZClfYnArgw6hzIZ.jpeg",
          "http://img.ubo.vip/uploads/15099395_64232926ec7c3/P8vDwhVWkc2mhCcYBkGc7gQC0gTAfgXSFXm9s19D.jpeg",
        ],
      },
    ],
    nearbyScenicSpotList: [
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖啤酒小镇",
        rate: 4.6,
        distance: "4.5km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖欢乐水世界",
        rate: 4.2,
        distance: "4.1km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖啤酒小镇",
        rate: 4.6,
        distance: "4.5km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖欢乐水世界",
        rate: 4.2,
        distance: "4.1km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖啤酒小镇",
        rate: 4.6,
        distance: "4.5km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖欢乐水世界",
        rate: 4.2,
        distance: "4.1km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖啤酒小镇",
        rate: 4.6,
        distance: "4.5km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖欢乐水世界",
        rate: 4.2,
        distance: "4.1km",
      },
    ],
    nearbyHotelList: [
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖美客爱途民宿",
        rate: 4.6,
        type: "舒适民宿",
        tag: "停车场",
        distance: "4.5km",
        basePrice: 566,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖瑞利淡竹度假",
        rate: 4.2,
        type: "高档酒店",
        tag: "商务出行",
        distance: "4.1km",
        basePrice: 500,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖美客爱途民宿",
        rate: 4.6,
        type: "舒适民宿",
        tag: "停车场",
        distance: "4.5km",
        basePrice: 566,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖瑞利淡竹度假",
        rate: 4.2,
        type: "高档酒店",
        tag: "商务出行",
        distance: "4.1km",
        basePrice: 500,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖美客爱途民宿",
        rate: 4.6,
        type: "舒适民宿",
        tag: "停车场",
        distance: "4.5km",
        basePrice: 566,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖瑞利淡竹度假",
        rate: 4.2,
        type: "高档酒店",
        tag: "商务出行",
        distance: "4.1km",
        basePrice: 500,
      },
    ],
    mediaList: [
      {
        address: "浙江省杭州市临平区龙王塘路67号",
        authorInfo: {
          id: 2,
          avatar:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiakPc4hxfvs8nTgLkh3jhN6B8jP2oz5J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
          nickname: "徐九爷_",
        },
        collectionTimes: 0,
        commentsNumber: 1,
        createdAt: "2023-03-23T09:29:12.000000Z",
        id: 8,
        imageList: [
          "https://img-oss.zjseca.com/tiddler/20230323/scbUJL8yqYkx3797935b97f13c42952827c2ef6c6ad0.jpeg",
          "https://img-oss.zjseca.com/tiddler/20230323/TA5rWT4s4GdZb18d5133f1d73ae62e933e7dc23e0a8b.jpeg",
        ],
        isPrivate: 0,
        likeNumber: 1,
        shareTimes: 0,
        title: "德鲁执杖走天涯",
        type: 3,
      },
      {
        address: "浙江省杭州市临平区龙王塘路67号",
        authorInfo: {
          id: 2,
          avatar:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiakPc4hxfvs8nTgLkh3jhN6B8jP2oz5J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
          nickname: "徐九爷_",
        },
        collectionTimes: 0,
        commentsNumber: 1,
        createdAt: "2023-03-23T09:20:48.000000Z",
        id: 7,
        imageList: [
          "https://img-oss.zjseca.com/tiddler/20230323/dTQ27KTCWLn316e54ed95df3478b397dec459abcfc6e.jpeg",
          "https://img-oss.zjseca.com/tiddler/20230323/hkPKOlR3fOqa34e9859fb717f10a61db1a7ab7495af3.jpeg",
          "https://img-oss.zjseca.com/tiddler/20230323/aTD6FUXdKoNWe4dc2ff790c33830645a31f2ae73de1b.jpeg",
        ],
        isPrivate: 0,
        likeNumber: 1,
        shareTimes: 0,
        title: "我是大狮子",
        type: 3,
      },
      {
        address: "浙江省杭州市临平区龙王塘路67号",
        authorInfo: {
          id: 2,
          avatar:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiakPc4hxfvs8nTgLkh3jhN6B8jP2oz5J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
          nickname: "徐九爷_",
        },
        collectionTimes: 0,
        commentsNumber: 1,
        cover:
          "http://img.ubo.vip/uploads/15037274_62e775067a757/kKWJhRpC3DfZldffTNQf8N9O4NBkJhRN3nt5TNHg.jpeg",
        createdAt: "2023-03-18T09:15:50.000000Z",
        id: 1,
        isPrivate: 0,
        likeNumber: 1,
        shareTimes: 0,
        title: "长相差一点没关系，但气质这一块咱不能输！",
        type: 2,
        videoUrl:
          "http://1301400133.vod2.myqcloud.com/d9ed72b2vodcq1301400133/8fdda551387702304098139138/nRWbjkRO2oYA.mp4",
      },
      {
        address: "浙江省杭州市临平区龙王塘路67号",
        authorInfo: {
          id: 2,
          avatar:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiakPc4hxfvs8nTgLkh3jhN6B8jP2oz5J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
          nickname: "徐九爷_",
        },
        collectionTimes: 0,
        commentsNumber: 0,
        cover:
          "http://1301400133.vod2.myqcloud.com/d9ed72b2vodcq1301400133/cf27f5ad5285890814604444619/5285890814604444621.jpg",
        createdAt: "2023-03-18T12:43:20.000000Z",
        id: 5,
        isPrivate: 0,
        likeNumber: 1,
        shareTimes: 0,
        title: "致逝去的青春",
        type: 2,
        videoUrl:
          "http://1301400133.vod2.myqcloud.com/d9ed72b2vodcq1301400133/cf27f5ad5285890814604444619/61lKaPKWj4cA.mp4",
      },
    ],
    curTicketInfo: null,
    noticePopupVisible: false,
    startDate: "",
    endDate: "",
    calendarPopupVisibel: false,
  },

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
      const roomList = hotelRoomList.filter((room) => room.typeId === item.id);
      return { ...item, roomList, fold: true };
    });
    const roomTypeIndexList = new Array(roomTypeList.length + 1)
      .fill("")
      .map((item, index) => index + 1);
    this.setData({ roomTypeIndexList, roomTypeList, indexList: [1, 2] });
  },

  setMenuList() {
    const { combinedTicketTypeList } = this.data;
    const menuList = combinedTicketTypeList.length
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
    this.setData({
      startDate: this.formatDate(start),
      endDate: this.formatDate(end),
      calendarPopupVisibel: false,
    });
  },

  onShareAppMessage() {},
});
