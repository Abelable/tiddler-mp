import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../../../store/index'
import BaseService from '../../../../service/baseService'

Page({
  data: {
    type: 4,
    newsList: []
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['unreadMsgCountOfInviteAuchor', 'unreadMsgCountOfInviteUser']
    })

    this.setNewsList(true)
  },

  selectMenu(e) {
    const type = Number(e.currentTarget.dataset.type)
    this.setData({ type })
    this.setNewsList(true)
  },

  async setNewsList(init = false) {
    const { type, newsList } = this.data
    const readTime = newsList.length ? newsList[newsList.length - 1].read_tim : 0
    if (init) this.page = 0
    const { list } = await new BaseService().getNewsList(type, ++this.page, readTime)
    this.setData({ 
      newsList: init ? list : [...newsList, ...list]
    })
    this.updateUnreadMsgCount()
  },

  updateUnreadMsgCount() {
    const { unreadMsgCount, unreadMsgCountOfInviteAuchor, unreadMsgCountOfInviteUser } = store
    switch (this.data.type) {
      case 4:
        if (unreadMsgCountOfInviteAuchor) {
          store.setUnreadMsgCountOfInviteAuchor(0)
          store.setUnreadMsgCount(unreadMsgCount - unreadMsgCountOfInviteAuchor)
        }
        break

      case 5:
        if (unreadMsgCountOfInviteUser) {
          store.setUnreadMsgCountOfInviteUser(0)
          store.setUnreadMsgCount(unreadMsgCount - unreadMsgCountOfInviteUser)
        }
        break
    }
  },
  
  onPullDownRefresh() {
    this.setNewsList(true)
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    this.setNewsList()
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings()
  }
})