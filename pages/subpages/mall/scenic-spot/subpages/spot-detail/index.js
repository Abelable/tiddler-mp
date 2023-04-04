const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarVisible: false,
    spotInfo: {
      status: 1,
      grade: 4.5,
      video:
        "http://1301400133.vod2.myqcloud.com/d9ed72b2vodcq1301400133/b617ca2a5285890819220454346/SrPypYJizP4A.mp4",
      imageList: [
        "https://img.ubo.vip/images/202208/thumb_img/0_thumb_P_1660717847911.jpg",
        "https://img.ubo.vip/images/202208/thumb_img/_thumb_P_1660717980300.jpg",
        "https://img.ubo.vip/images/202208/thumb_img/_thumb_P_1660717983502.jpg",
        "https://img.ubo.vip/images/202208/thumb_img/_thumb_P_1660717985198.jpg",
      ],
    },
    curDot: 1,
    muted: true,
    ticketTypeList: ["成人票", "儿童票", "老人票", "学生票"],
    curTicketTypeIdx: 0,
    ticketList: [
      {
        name: "门票",
        basePrice: 40,
        fold: true,
        list: [
          {
            shopType: 1,
            shopName: "千岛湖旅游",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 3000,
            price: 40,
          },
          {
            shopType: 2,
            shopName: "小鱼度假",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 10,
            price: 40,
          },
          {
            shopType: 3,
            shopName: "浙风旅行社",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 10,
            price: 40,
          },
        ],
      },
      {
        name: "门票+项目",
        basePrice: 60,
        fold: true,
        list: [
          {
            shopType: 1,
            shopName: "千岛湖旅游",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 3000,
            price: 60,
          },
          {
            shopType: 2,
            shopName: "小鱼度假",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 10,
            price: 60,
          },
        ],
      },
    ],
    combinedTicketTypeList: ["成人票", "儿童票", "老人票", "学生票"],
    curCombinedTicketTypeIdx: 0,
    combinedTicketList: [
      {
        name: "森林氧吧+钓鱼岛观光游船",
        basePrice: 90,
        fold: true,
        list: [
          {
            shopType: 1,
            shopName: "千岛湖旅游",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 3000,
            price: 90,
          },
          {
            shopType: 2,
            shopName: "小鱼度假",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 10,
            price: 90,
          },
          {
            shopType: 3,
            shopName: "浙风旅行社",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 10,
            price: 90,
          },
        ],
      },
      {
        name: "森林氧吧+水之灵剧场(嘉宾席)",
        basePrice: 210,
        fold: true,
        list: [
          {
            shopType: 1,
            shopName: "千岛湖旅游",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 3000,
            price: 210,
          },
          {
            shopType: 2,
            shopName: "小鱼度假",
            tips: "出票3小时后可用",
            bookingTips: "可订今日",
            needChange: false,
            isRefundable: true,
            salesVolume: 10,
            price: 210,
          },
        ],
      },
    ],
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
    mediaList: [
      {
        address: "浙江省杭州市临平区龙王塘路67号",
        authorInfo: {
          id: 2,
          avatar:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKi…J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
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
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKi…J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
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
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKi…J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
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
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKi…J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
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
  },

  onLoad(options) {},

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

  fullScreenPlay() {},

  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({ current, urls });
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  selectTicketType(e) {
    this.setData({
      curTicketTypeIdx: Number(e.currentTarget.dataset.index),
    });
  },

  toggleTicketsFold(e) {
    const { index } = e.currentTarget.dataset;
    const { ticketList } = this.data;
    this.setData({
      [`ticketList[${index}].fold`]: !ticketList[index].fold,
    });
  },

  selectCombinedTicketType(e) {
    this.setData({
      curCombinedTicketTypeIdx: Number(e.currentTarget.dataset.index),
    });
  },

  toggleCombinedTicketsFold(e) {
    const { index } = e.currentTarget.dataset;
    const { combinedTicketList } = this.data;
    this.setData({
      [`combinedTicketList[${index}].fold`]: !combinedTicketList[index].fold,
    });
  },

  onShareAppMessage() {},
});
