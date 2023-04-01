const { statusBarHeight } = getApp().globalData.systemInfo;


Page({
  data: {
    statusBarHeight,
    navBarVisible: false,
    spotInfo: {
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

  onShareAppMessage() {
  }
})
