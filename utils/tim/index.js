import TIM from 'tim-wx-sdk'
import COS from 'cos-wx-sdk-v5'
import { emojiMap, emojiUrl } from './emojiMap'
import { store } from '../../store/index'

class Im {
  constructor(SDKAppID, userID, userSig) {
    let tim = TIM.create({ SDKAppID })
    tim.registerPlugin({'cos-wx-sdk': COS})
    tim.setLogLevel(1)
    tim.on(TIM.EVENT.SDK_READY, this.onTimSdkReady)
    tim.on(TIM.EVENT.SDK_NOT_READY, this.onTimSdkReady)
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onConvListUpdate)
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onMsgReceive.bind(this))
    tim.login({ userID, userSig })
    this.tim = tim
  }

  // 加群
  joinGroup(groupID) {
    return this.tim.joinGroup({ groupID, type: TIM.TYPES.GRP_AVCHATROOM }).catch(err => {
      console.warn('joinGroup error:', err) // 进群失败的相关信息
    })
  }

  // 退群
  quitGroup(groupID) {
    return this.tim.quitGroup(groupID).catch(err => {
      console.warn('quitGroup error:', err) // 退群失败的相关信息
    })
  }

  // 发送群聊消息
  sendLiveMsg(msg, selToId, userInfo) {
    const { userID, userName, userAvatar, gradeType } = userInfo
    const message = this.tim.createTextMessage({
      to: selToId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        text: JSON.stringify({
          data: { 
            user_id: userID, 
            nick_name: userName, 
            headimg: userAvatar, 
            gradetype: gradeType,
            show_message: msg,
            usertype: 0,
            is_anchor: false
          }
        })
      }
    })
    this.tim.sendMessage(message).then(res => {
      const { nick_name: nickname, show_message: message, gradetype, ...rest } = JSON.parse(res.data.message.payload.text.replace(/&quot;/g, "\"")).data
      const msg = { nickname, message, gradetype: gradetype &&  Number(gradetype), ...rest }
      store.setLiveMsgList(msg)
    }).catch(() => {
      wx.showToast({ title: '消息发送失败', icon: 'none' })
    })
  }

  // 发送普通文本消息
  sendMsg(msg, selToId) {
    const message = this.tim.createTextMessage({
      to: selToId,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: { text: msg }
    })
    this.tim.sendMessage(message).then(res => {
      const msg = this.handleC2CMsg(res.data.message)
      store.setMsgList(msg)
    }).catch(err => {
      wx.showToast({ title: '消息发送失败', icon: 'none' })
    })
  }

  // 发送自定义消息
  sendCustomMsg(msg, selToId) {
    const message = this.tim.createCustomMessage({
      to: selToId,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: { data: msg }
    })
    this.tim.sendMessage(message).then(res => {
      const msg = this.handleC2CMsg(res.data.message)
      store.setMsgList(msg)
    }).catch(err => {
      wx.showToast({ title: '消息发送失败', icon: 'none' })
    })
  }

  // 发送图片
  sendImage(src, selToId) {
    const message = this.tim.createImageMessage({
      to: selToId,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: { file: src }
    })
    this.tim.sendMessage(message).then(res => {
      const msg = this.handleC2CMsg(res.data.message)
      store.setMsgList(msg)
    }).catch(err => {
      wx.showToast({ title: '消息发送失败', icon: 'none' })
    })
  }

  // 获取历史消息列表
  getMsgList(conversationID, count = 15) {
    this.tim.getMessageList({ conversationID, count }).then(res => {
      const { messageList = [] } = res.data || {}
      let msgArr = []
      messageList.forEach((item, index) => {
        msgArr[index] = this.handleC2CMsg(item)
      })
      store.setMsgList(msgArr)
    })
  }

  // 删除会话
  deleteConversation(id) {
    return this.tim.deleteConversation(id)
  }

  // 消息已读
  setMessageRead(conversationID) {
    return this.tim.setMessageRead({ conversationID }).then(() => {
      let { unreadMsgCount } = store
      if (unreadMsgCount > 0) store.setUnreadMsgCount(--unreadMsgCount)
    })
  }

  onTimSdkReady({ name }) {
    store.setTimSdkReady(name === TIM.EVENT.SDK_READY)
  }

  onConvListUpdate({ data = [] }) {
    let contactList = []
    let { unreadMsgCount } = store
    data.forEach(item => {
      let { type, userProfile, lastMessage, unreadCount } = item
      let { userID: friendId, nick: friendName, avatar: friendAvatarUrl } = userProfile || {}
      let { lastTime: msgTime, messageForShow: msg } = lastMessage || {}
      type === TIM.TYPES.CONV_C2C && (contactList.push({ friendId, friendName, friendAvatarUrl, msgTime, msg, unreadMsgCount: unreadCount }), unreadMsgCount += unreadCount)
    })
    store.setContactList(contactList)
    store.setUnreadMsgCount(unreadMsgCount)
  }

  onMsgReceive({ data = [] }) {
    data.forEach(item => {
      const { conversationType, payload } = item
      switch (conversationType) {
        case TIM.TYPES.CONV_SYSTEM:
          const customMsg = typeof(payload.userDefinedField) === 'string' ? JSON.parse(payload.userDefinedField).data : null
          customMsg && store.setLiveCustomMsg(customMsg)
          break

        case TIM.TYPES.CONV_GROUP:
          const { nick_name: nickname, show_message: message, gradetype, ...rest } = typeof(payload.text) === 'string' ? JSON.parse(payload.text.replace(/&quot;/g, "\"")).data : {}
          const liveMsg = nickname ? { nickname, message, gradetype: gradetype && Number(gradetype), ...rest } : null
          if (!this.liveMsgCache) this.liveMsgCache = []
          liveMsg && this.liveMsgCache.push(liveMsg)
          if (!this.setLiveMsgListTimeout) {
            this.setLiveMsgListTimeout = setTimeout(() => {
              store.setLiveMsgList(this.liveMsgCache)
              this.liveMsgCache = []
              this.setLiveMsgListTimeout = null
            }, 1200)
          }
          break

        case TIM.TYPES.CONV_C2C:
          const msg = this.handleC2CMsg(item)
          store.setMsgList(msg)
          break
      }
    })
  }

  handleC2CMsg(item) {
    const { type, payload, flow, time } = item
    let content
    switch (type) {
      case TIM.TYPES.MSG_TEXT:
        let value = []
        const textArr = payload.text.replace(/\[/g, '_tbb_[').replace(/\]/g, ']_tbb_').split('_tbb_')
        const reg = /\[[^[\]]{1,3}\]/m
        textArr.forEach((item, index) => {
          value[index] = {
            type: reg.test(item) ? 'emoji' : 'text',
            value: reg.test(item) ? `${emojiUrl}${emojiMap[item]}` : item
          }
        })
        content = { type: 'text', value }
        break

      case TIM.TYPES.MSG_CUSTOM:
        value = JSON.parse(JSON.parse(payload.data).data)
        let _type
        switch (value.type) {
          case '1':
            _type = 'goods'
            break
          case '2':
            _type = 'order'
            break
        }
        content = { type: _type, value }
        break

      case TIM.TYPES.MSG_IMAGE:
        content = {
          type: 'img',
          value: payload.imageInfoArray[0].imageUrl
        } 
        break

      case TIM.TYPES.MSG_AUDIO:
        content = { 
          type: 'text', 
          value: '[小程序暂不支持语音消息]'
        }
        break
    }
    return { flow, time, content }
  }
}

export default Im
