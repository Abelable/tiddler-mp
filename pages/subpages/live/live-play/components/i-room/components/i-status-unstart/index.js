import checkLogin from '../../../../../../../../utils/checkLogin'
import BaseService from '../../../../../../../../service/baseService'

const baseService = new BaseService()
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  properties: {
    roomInfo: {
      type: Object,
      observer(info) {
        if (info) {
          const { status, startTime } = info
          !status && this.setCountDown(startTime)
        }
      }
    }
  },

  data: {
    statusBarHeight,
    time: 0
  },

  detached() {
    clearInterval(this.countDownInterval)
  },

  methods: {
    share() {
      this.triggerEvent('share', { type: 'poster' })
    },

    toggleSubscribe() {
      checkLogin(() => {
        const { id, previewDestine } = this.properties.roomInfo
        if (previewDestine == 0) {
          baseService.subscribeAnchor(id, data => {
            if (data) {
              wx.showToast({ title: '订阅成功', icon: 'none' })
              this.setData({ ['roomInfo.previewDestine']: 1 })
            }
          }, err => {
            err && wx.showToast({ title: err.data.message, icon: 'none' })
          })
        } else {
          baseService.unSubscribeAnchor(id, data => {
            if (data) {
              wx.showToast({ title: '取消订阅成功', icon: 'none' })
              this.setData({ ['roomInfo.previewDestine']: 0 })
            }
          }, err => {
            err && wx.showToast({ title: err.data.message, icon: 'none' })
          })
        }
      })
    },

    setCountDown(startTime) {
      const currentTime = (new Date()).getTime() / 1000
      let time = startTime - currentTime
      this.setData({ time })
      this.countDownInterval = setInterval(() => {
        if (time > 0) {
          --time
          this.setData({ time })
        } else clearInterval(this.countDownInterval)
      }, 1000)
    }
  }
})