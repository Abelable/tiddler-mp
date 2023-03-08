import TIM from 'tim-wx-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
import { store } from '../../store/index'
import { 
  onConversationListUpdate, 
  getMsgList, 
  deleteConversation, 
  setMessageRead, 
  sendMsg, 
  sendCustomMsg, 
  sendImage, 
  handleC2CMsg 
} from './C2C'
import {
  joinGroup,
  quitGroup,
  sendLiveChatMsg,
  sendLiveCustomMsg,
  handleLiveCustomMsg,
  handleLiveChatMsg
} from './group'

const init = (SDKAppID, userID, userSig) => {
  const tim = TIM.create({ SDKAppID })
  tim.setLogLevel(1)
  tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
  tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdate)
  tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMsgReceive)
  tim.login({ userID, userSig })
  store.setTim(tim)
}

const logout = () => {
  store.tim.off(TIM.EVENT.MESSAGE_RECEIVED, onMsgReceive)
  store.tim.logout()
  store.setTim(null)
}

const onMsgReceive = ({ data = [] }) => {
  data.forEach(item => {
    const { conversationType, type, payload } = item
    switch (conversationType) {
      case TIM.TYPES.CONV_SYSTEM:
        if (type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
          handleLiveCustomMsg(payload)
        }
        break

      case TIM.TYPES.CONV_GROUP:
        if (type === TIM.TYPES.MSG_TEXT) {
          handleLiveChatMsg(payload)
        } else if (type === TIM.TYPES.MSG_CUSTOM) {
          handleLiveCustomMsg(payload)
        }
        break

      case TIM.TYPES.CONV_C2C:
        handleC2CMsg(item)
        break
    }
  })
}

export default {
  init,
  logout,
  getMsgList, 
  deleteConversation, 
  setMessageRead, 
  sendMsg, 
  sendCustomMsg, 
  sendImage,
  joinGroup,
  quitGroup,
  sendLiveChatMsg,
  sendLiveCustomMsg,
}
