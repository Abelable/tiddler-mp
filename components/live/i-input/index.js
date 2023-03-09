import { store } from '../../../../../../store/index'
import im from '../../../../../../utils/im/index'
import BaseService from '../../../../../../services/baseService'

const baseService = new BaseService()

Component({
  properties: {
    defaultValue: String,
    roomInfo: Object,
    isLivePush: Boolean
  },

  data: {
    containerBottom: 0,
    focus: true,
    phraseList: [],
  },

  lifetimes: {
    attached() {
      this.setPhraseList()
      this.setTagList()
      this.setSensitiveWordList()
    }
  },
  
  methods: {
    async setPhraseList() {
      const { studio_id, type_name } = this.properties.roomInfo
      const { list: phraseList = [] } = await baseService.getPhraseList(studio_id, type_name === '创建者' ? 1 : 2) || {}
      this.setData({ phraseList })
    },

    async setTagList() {
      baseService.setCurUserTagList(this.properties.roomInfo.studio_id, store.userInfo.id)
    },

    async setSensitiveWordList() {
      const { list = [] } = await baseService.getPhraseList(this.properties.roomInfo.studio_id, 3) || {}
      this.sensitiveWordList = list
    },

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
      if (!this.inputValue) {
        wx.showToast({ icon: 'none', title: '消息不能为空' })
        return
      }
      this.sendMessage(this.inputValue)
      this.inputValue = ''
      this.properties.isLivePush ? this.triggerEvent('hide') : store.hideModal()
    },

    sendPhrase(e) {
      this.sendMessage(e.currentTarget.dataset.phrase)
      this.properties.isLivePush ? this.triggerEvent('hide') : store.hideModal()
    },

    // 发送消息
    async sendMessage(msg) {
      const { id: room_id, group_id, type_name } = this.properties.roomInfo
      let { id: user_id, name, avatar } = store.userInfo

      // 马甲
      if (type_name && store.vestInfo) {
        name = store.vestInfo.name
        avatar = store.vestInfo.head_img
      }

      const chatMsg = {
        user_id,
        nick_name: name, 
        head_img: avatar,
        type_name,
        tag: store.userTagList,
        message: msg,
        time: Date.parse(new Date()) / 1000
      }

      store.setLiveMsgList(chatMsg)

      // 敏感词过滤
      if (!type_name) {
        const index = this.sensitiveWordList.findIndex(item => msg.replace(/\s*/g,"").includes(item.content))
        if (index !== -1) {
          return
        }
      }

      // 当前用户被禁言
      if (store.curUserIsBan) {
        return
      }

      baseService.saveLiveMsg(room_id, name, avatar, type_name, JSON.stringify(store.userTagList), msg, chatMsg.time)
      im.sendLiveChatMsg(group_id, chatMsg)
    }
  }
})
