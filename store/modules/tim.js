import { action } from 'mobx-miniprogram'

export default {
  tim: null,
  contactList: [],
  unreadMsgCount: 0,

  setTim: action(function (tim) {
    this.tim = tim
  }),
  setContactList: action(function (contactList) {
    this.contactList = contactList
  }),
  setUnreadMsgCount: action(function (count) {
    this.unreadMsgCount = count
  }),
}
