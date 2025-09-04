import { action } from 'mobx-miniprogram'

export default {
  tim: null,
  contactList: [],
  msgList: [],
  unreadMsgCount: 0,

  setTim: action(function (tim) {
    this.tim = tim
  }),
  setContactList: action(function (contactList) {
    this.contactList = contactList
  }),
  setMsgList: action(function (msg) {
    switch (msg.constructor) {
      case Array:
        this.msgList = msg
        break
      case Object:
        this.msgList = [...this.msgList, msg]
        break
    }
  }),
  setUnreadMsgCount: action(function (count) {
    this.unreadMsgCount = count
  }),
}
