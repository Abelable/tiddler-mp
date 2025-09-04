import TIM from 'tim-wx-sdk'
import { store } from '../../store/index'
import { emojiMap, emojiUrl } from './emojiMap'

export const onConversationListUpdate = ({ data = [] }) => {
  let unreadMsgCount = 0
  const contactList = data.map(({ type, userProfile, lastMessage, unreadCount }) => {
    if (type === TIM.TYPES.CONV_C2C) {
      unreadMsgCount += unreadCount

      const { userID: friendId, nick: friendName, avatar: friendAvatarUrl } = userProfile || {}
      const { lastTime: msgTime, messageForShow: msg } = lastMessage || {}
      return { friendId, friendName, friendAvatarUrl, msgTime, msg, unreadMsgCount: unreadCount }
    }
  })
  store.setContactList(contactList)
  store.setUnreadMsgCount(unreadMsgCount + store.unreadMsgCount)
}

// 获取历史消息列表
export const getMsgList = (conversationID, count = 15) => {
  return store.tim.getMessageList({ conversationID, count }).catch(err => {
    console.warn('getMsgList error:', err)
  })
}

// 删除会话
export const deleteConversation = (id) => {
  return store.tim.deleteConversation(id).catch(err => {
    console.warn('deleteConversation error:', err)
  })
}

// 消息已读
export const setMessageRead = (conversationID) => {
  return store.tim.setMessageRead({ conversationID }).catch(err => {
    console.warn('setMessageRead error:', err)
  })
}

// 发送普通文本消息
export const sendMsg = (msg, selToId) => {
  const message = store.tim.createTextMessage({
    to: selToId,
    conversationType: TIM.TYPES.CONV_C2C,
    payload: { text: msg }
  })
  return store.tim.sendMessage(message).catch(err => {
    console.warn('sendMsg error:', err)
  })
}

// 发送自定义消息
export const sendCustomMsg = (msg, selToId) => {
  const message = store.tim.createCustomMessage({
    to: selToId,
    conversationType: TIM.TYPES.CONV_C2C,
    payload: { data: msg }
  })
  return store.tim.sendMessage(message).catch(err => {
    console.warn('sendCustomMsg error:', err)
  })
}

// 发送图片
export const sendImage = (src, selToId) => {
  const message = store.tim.createImageMessage({
    to: selToId,
    conversationType: TIM.TYPES.CONV_C2C,
    payload: { file: src }
  })
  return store.tim.sendMessage(message).catch(err => {
    console.warn('sendImage error:', err)
  })
}

export const handleC2CMsg = (item) => {
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
