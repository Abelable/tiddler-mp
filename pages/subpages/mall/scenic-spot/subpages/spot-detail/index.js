const { statusBarHeight } = getApp().globalData.systemInfo;


Page({
  data: {
    statusBarHeight,
    navBarVisible: false,
    spotInfo: {
      status: 1,
      grade: 4.5,
      video: 'http://1301400133.vod2.myqcloud.com/d9ed72b2vodcq1301400133/b617ca2a5285890819220454346/SrPypYJizP4A.mp4',
      imageList: [
        'https://img.ubo.vip/images/202208/thumb_img/0_thumb_P_1660717847911.jpg',
        'https://img.ubo.vip/images/202208/thumb_img/_thumb_P_1660717980300.jpg',
        'https://img.ubo.vip/images/202208/thumb_img/_thumb_P_1660717983502.jpg',
        'https://img.ubo.vip/images/202208/thumb_img/_thumb_P_1660717985198.jpg',
      ]
    },
    curDot: 1,
    muted: true,
    ticketTypeList: ['成人票', '儿童票', '老人票', '学生票'],
    curTicketTypeIdx: 0,
    ticketList: [
      {
        name: '门票',
        basePrice: 40,
        fold: true,
        list: [
          {
            shopType: 1,
            shopName: '千岛湖旅游',
            tips: '出票3小时后可用',
            bookingTips: '可订今日',
            needChange: false,
            isRefundable: true,
            salesVolume: 3000,
            price: 40
          },
          {
            shopType: 2,
            shopName: '小鱼度假',
            tips: '出票3小时后可用',
            bookingTips: '可订今日',
            needChange: false,
            isRefundable: true,
            salesVolume: 10,
            price: 40
          },
          {
            shopType: 3,
            shopName: '浙风旅行社',
            tips: '出票3小时后可用',
            bookingTips: '可订今日',
            needChange: false,
            isRefundable: true,
            salesVolume: 10,
            price: 40
          }
        ]
      },
      {
        name: '门票+骑行',
        basePrice: 40,
        fold: true,
        list: [
          {
            shopType: 1,
            shopName: '千岛湖旅游',
            tips: '出票3小时后可用',
            bookingTips: '可订今日',
            needChange: false,
            isRefundable: true,
            salesVolume: 3000,
            price: 40
          },
          {
            shopType: 2,
            shopName: '小鱼度假',
            tips: '出票3小时后可用',
            bookingTips: '可订今日',
            needChange: false,
            isRefundable: true,
            salesVolume: 10,
            price: 40
          }
        ]
      }
    ],
    combinedTicketList: [],
  },

  onLoad(options) {
    this.player = wx.createVideoContext("video-player");
  },

  bannerChange(e) {
    this.setData({
      curDot: e.detail.current + 1
    })
  },

  toggleMuted() {
    this.setData({
      muted: !this.data.muted
    })
  },

  fullScreenPlay() {
    this.player.requestFullScreen()
  },

  previewImage(e) {
    const { current, urls } =  e.currentTarget.dataset
    wx.previewImage({ current, urls })
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  selectTicketType(e) {
    this.setData({
      curTicketTypeIdx: Number(e.currentTarget.dataset.index)
    })
  },

  toggleFold(e) {
    const { index } = e.currentTarget.dataset
    const { ticketList } = this.data
    this.setData({
      [`ticketList[${index}].fold`]: !ticketList[index].fold
    })
  },

  onShareAppMessage() {
  }
})
