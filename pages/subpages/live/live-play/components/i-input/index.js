import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../store/index'
import RoomService from '../../utils/roomService'

let roomService = new RoomService()

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['userInfo', 'followStatus', 'fansRank'],
    actions: ['setLiveMsgList', 'hideModal']
  },

  properties: {
    roomInfo: Object
  },

  data: {
    phraseLists: []
  },

  lifetimes: {
    async attached() {
      this.setData({ 
        phraseLists: await roomService.getChatPhraseLists()
      })
    }
  },

  data: {
    containerBottom: 0,
    focus: true
  },
  
  methods: {
    // 消息输入
    bindInput(e) {
      this.inputValue = e.detail.value
    },

    setContainerBottom(e) {
      this.setData({
        containerBottom: e.detail.height
      })
    },

    setFocus() {
      this.setData({ focus: true })
    },

    // 过滤消息
    filterMsg() {
      if (this.inputValue) {
        const reg = new RegExp("(微信|QQ|qq|weixin|1[0-9]{10}|[a-zA-Z0-9\-\_]{6,16}|[0-9]{6,11})+",'g')
        this.sendMessage(this.inputValue.replace(reg, '**'))
      } else wx.showToast({ icon: 'none', title: '消息不能为空' })
      this.inputValue = ''
      this.hideModal()
    },

    sendPhrase(e) {
      this.sendMessage(e.currentTarget.dataset.phrase)
      this.hideModal()
    },

    // 发送消息
    async sendMessage(msg) {
      const { id, groupId } = this.properties.roomInfo
      const { userInfo, followStatus, fansRank } = this.data
      const { userID, userName, userAvatar } = userInfo
      const gradeType = followStatus ? fansRank : 0 
      const { message: handleMsg } = await roomService.saveMsg(id, userID, userAvatar, userName, gradeType, msg) || {} // 后台保存消息
      handleMsg && getApp().globalData.im.sendLiveMsg(handleMsg, groupId, { userID, userName, userAvatar, gradeType })
    }
  }
})