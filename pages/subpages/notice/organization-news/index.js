import { store } from '../../../../store/index'
import BaseService from '../../../../service/baseService'

Page({
  data: {
    newsList: []
  },

  onLoad() {
    this.setNewsList(true)
    this.updateUnreadMsgCount()
  },

  async setNewsList(init = false) {
    const { newsList } = this.data
    const readTime = newsList.length ? newsList[newsList.length - 1].read_tim : 0
    if (init) this.page = 0
    const { list } = await new BaseService().getNewsList(9, ++this.page, readTime)
    this.setData({ 
      newsList: init ? list : [...newsList, ...list]
    })
  },

  updateUnreadMsgCount() {
    const { unreadMsgCount, unreadMsgCountOfOrganization } = store
    if (unreadMsgCountOfOrganization) {
      store.setUnreadMsgCountOfOrganization(0)
      store.setUnreadMsgCount(unreadMsgCount - unreadMsgCountOfOrganization)
    }
  },

  onPullDownRefresh() {
    this.setNewsList(true)
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    this.setNewsList()
  }
})