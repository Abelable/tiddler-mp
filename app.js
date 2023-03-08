import BaseService from './services/baseService'
import { checkLogin } from './utils/index'
import tim from './utils/tim/index'

const baseService = new BaseService()

App({
  globalData: {
    statusBarHeight: '',
    windowHeight: '',
    liveCustomMsg: null,
  },

  async onLaunch() {
    this.setSystemInfo()
    if (!wx.getStorageSync('token')) {
      await baseService.login()
    }
    checkLogin(this.init, false)
  },

  onShow() {
    this.update()
  },

  async init() {
    const { id: userId } = await baseService.getUserInfo()
    const { sdkAppId, userSig } = await baseService.getTimLoginInfo()
    tim.init(Number(sdkAppId), String(userId), userSig)
  },

  setSystemInfo() {
    wx.getSystemInfo({
      success: res => {
        const { windowHeight, statusBarHeight } = res
        this.globalData.statusBarHeight = statusBarHeight
        this.globalData.windowHeight = windowHeight
      }
    })
  },

  update() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: res => {
                res.confirm && updateManager.applyUpdate()
              }
            })
          })
          updateManager.onUpdateFailed(() => {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  // 监听直播间自定义消息
  onLiveCustomMsgReceive(handler) {
    Object.defineProperty(this.globalData, 'liveCustomMsg', {
      configurable: true,
      enumerable: true,
      set: (value) => {
        this.value = value
        handler(value)
      },
      get: () => {
        return this.value
      }
    })
  }
})
