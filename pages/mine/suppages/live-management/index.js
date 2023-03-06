import BaseService from '../../../../services/baseService'

const baseService = new BaseService()

Page({
  data: {
    directionList: [
      { en: 'horizontal', ch: '横屏展示', desc: '适合授课直播' },
      { en: 'vertical', ch: '竖屏展示', desc: '适合带货直播' }
    ],
    cover: '',
    roomName: '',
    uploadCoverLoading: false,
    direction: 2,
    mode: 1,
    privite: false,
    showPlayback: false,
    onlyForWhite: false,
    allowComment: true,
    enableNotice: true,
    showInCalendar: true,
    pushStreamUrl: '',
    pickGoodsPopupVisible: false,
    explainPopupVisible: false,
    obsPopupVisible: false,
    previewDate: ''
  },

  onLoad() {
  },

  onShow() {
  },

  async setUserStudioInfo() {
    const info = await baseService.getUserStudioInfo() || {}
    if (info.id) {
      store.setStudioInfo(info)
      this.studioInfo = info
    }
  },

  selectResolution(e) {
    this.setData({
      curResolutionIdx: Number(e.currentTarget.dataset.index)
    })
  },

  navToCropperPage() {
    if (!this.data.uploadCoverLoading) {
      wx.navigateTo({
        url: '/pages/subpages/common/cropper/index',
      })
    }
  },

  async uploadCover() {
    const { tempFilePaths } = await baseService.chooseImage(1)
    const res = await baseService.uploadFile(tempFilePaths[0])
    console.log(res)
  },

  inputRoomName(e) {
    this.roomName = e.detail.value
  },

  selectDirection(e) {
    this.setData({
      direction: Number(e.currentTarget.dataset.direction)
    })
  },

  selectMode(e) {
    this.setData({
      mode: Number(e.currentTarget.dataset.mode)
    })
  },

  togglePrivate(e) {
    this.setData({
      privite: e.detail.value
    })
  },

  toggleShowPlayback(e) {
    this.setData({
      showPlayback: e.detail.value
    })
  },

  toggleOnlyForWhite(e) {
    this.setData({
      onlyForWhite: e.detail.value
    })
  },

  toggleAllowComment(e) {
    this.setData({
      allowComment: e.detail.value
    })
  },

  toggleEnableNotice(e) {
    this.setData({
      enableNotice: e.detail.value
    })
  },

  toggleShowInCalendar(e) {
    this.setData({
      showInCalendar: e.detail.value
    })
  },

  inputPassword(e) {
    this.password = e.detail.value
  },

  cancelPreview() {
    this.noticeTime = ''
    this.setData({ previewDate: '' })
  },

  setPreviewDate(e) {
    const { date, dateString } = e.detail
    this.noticeTime = Date.parse(date) / 1000
    this.setData({
      previewDate: dateString.slice(0, -3)
    })
  },

  async startLive() {
    const { cover, direction, mode, curResolutionIdx, privite, showPlayback, onlyForWhite, allowComment, enableNotice, showInCalendar } = this.data
    if (!cover) {
      wx.showToast({ title: '请添加展示图片', icon: 'none' })
      return
    }
    if (!this.roomName) {
      wx.showToast({ title: '请输入房间名称', icon: 'none' })
      return
    }

    if (!this.noticeTime && this.unable) {
      wx.showToast({ title: '已有正在直播、或待开播的直播间，只能创建预告哦～', icon: 'none' })
      return
    }

    if (this.password && this.password.length !== 6) {
      wx.showToast({ title: '请输入6位数字密码', icon: 'none' })
      return
    }
    let youbo_good_id = ''
    for(let i = 0;i < this.data.youboChooseList.length; i++){
      youbo_good_id += youbo_good_id == '' ? this.data.youboChooseList[i].id : ',' + this.data.youboChooseList[i].id
    }
    const { room_id, push_stream_url } = await homeService.createLiveRoom(this.roomName, cover, direction, mode, curResolutionIdx + 1, privite ? 1 : 0, showPlayback ? 1 : 2, onlyForWhite ? 1: 0, allowComment ? 0 : 1, enableNotice ? 1 : 0, showInCalendar ? 1 : 0, this.password || '', this.noticeTime || '', store.studioInfo.id, youbo_good_id, () => {
      wx.showModal({
        title: '暂未开通直播权限',
        content: '复制微信号youbodd666，联系客服开通权限吧～',
        confirmText: '复制',
        success: (result) => {
          if (result.confirm) {
            wx.setClipboardData({ 
              data: 'youbodd666',
              success() {
                wx.showToast({
                  title: '复制成功',
                  icon: 'none',
                })
              }
            })
          }
        }
      })
    }) || {}

    if (room_id) {
      if (!this.noticeTime) {
        this.roomId = room_id
        if (this.data.mode === 2) {
          this.setData({ 
            pushStreamUrl: push_stream_url,
            obsPopupVisible: true 
          })
          return
        }
        this.navToLivePushPage()
      } else {
        wx.navigateTo({
          url: `/pages/subpages/home/live-push/subpages/live-notice/index?id=${room_id}`
        })
      }
    }
  },

  navToLivePushPage() {
    const { mode, direction } = this.data
    if (mode == 1 && direction == 1) {
      wx.navigateTo({
        url: `/pages/subpages/home/live-push-horizontal/index?id=${this.roomId}`
      })
    } else {
      wx.navigateTo({
        url: `/pages/subpages/home/live-push/index?id=${this.roomId}&mode=${mode}&direction=${direction}`
      })
    }
  },

  showPickGoodsPopup() {
    if(this.studioInfo&&this.studioInfo.bind_youbo_mobile){
      this.setData({
        pickGoodsPopupVisible: true
      })
    }else{
      wx.navigateTo({
        url: '/pages/subpages/home/mall/index'
      })
    }
  },

  showExplainPopup() {
    this.setData({
      explainPopupVisible: true
    })
  },

  hideModal() {
    const { obsPopupVisible, explainPopupVisible, pickGoodsPopupVisible } = this.data
    if (obsPopupVisible) this.setData({ obsPopupVisible: false })
    if (explainPopupVisible) this.setData({ explainPopupVisible: false })
    if (pickGoodsPopupVisible) this.setData({ pickGoodsPopupVisible: false })
  },
})
