import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../store/index'
import LiveService from '../utils/liveService'

const liveService = new LiveService()

Page({
  data: {
    uploadCoverLoading: false,
    uploadShareCoverLoading: false,
    cover: '',
    shareCover: '',
    direction: 1,
    isMerchant: false,
    pickedGoodsIds: [],
    noticeTimeString: '',
    isNotice: false,
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['userInfo'],
    })
  },

  async uploadCover() {
    if (!this.data.uploadCoverLoading) {
      this.setData({ uploadCoverLoading: true })
      const { tempFilePaths } = await liveService.chooseImage(1) || {}
      if (tempFilePaths) {
        const cover = await liveService.uploadFile(tempFilePaths[0])
        this.setData({ cover })
      }
      this.setData({ uploadCoverLoading: false })
    }
  },

  async uploadShareCover() {
    if (!this.data.uploadShareCoverLoading) {
      this.setData({ uploadShareCoverLoading: true })
      const { tempFilePaths } = await liveService.chooseImage(1) || {}
      if (tempFilePaths) {
        const shareCover = await liveService.uploadFile(tempFilePaths[0])
        this.setData({ shareCover })
      }
      this.setData({ uploadShareCoverLoading: false })
    }
  },

  setTitle(e) {
    this.title = e.detail.value
  },

  selectDirection(e) {
    this.setData({
      direction: Number(e.currentTarget.dataset.direction)
    })
  },

  selectGoods() {
    
  },

  toggleIsNotice(e) {
    this.setData({
      isNotice: e.detail.value
    })
  },

  setNoticeTime(e) {
    const { date, dateString } = e.detail
    this.noticeTime = `${Date.parse(date)}`
    this.setData({
      noticeTimeString: dateString.slice(0, -3)
    })
  },

  async startLive() {
    const { cover, shareCover, direction, pickedGoodsIds, isNotice } = this.data

    if (!cover) {
      wx.showToast({ title: '请上传列表封面', icon: 'none' })
      return
    }
    if (!shareCover) {
      wx.showToast({ title: '请上传分享封面', icon: 'none' })
      return
    }
    if (!this.title) {
      wx.showToast({ title: '请输入直播标题', icon: 'none' })
      return
    }
    if (isNotice && !this.noticeTime) {
      wx.showToast({ title: '请设置预告时间', icon: 'none' })
      return
    }

    liveService.createLive(this.title, cover, shareCover, direction, pickedGoodsIds, this.noticeTime, () => {
      const url = isNotice ? `../live-notice/index` : `../live-push/index`
      wx.navigateTo({ url })
    })
  },
})
